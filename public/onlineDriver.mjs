import Game from "./game.mjs";
import GameElement from "./renderer.mjs";
import { State } from "./state.mjs";
import { FRAME_RATE, HEARTBEAT_RATE } from "./config.mjs";
import LocalDriver from "./localDriver.mjs";

export default class OnlineDriver extends LocalDriver {

    constructor (parent, peerParent, socket) {
        super(parent);

        this.socket = socket;

        this.peerRecord = [{state: new State(), inputs: []}];
        this.inputsRecord = [];

        this.recordIndex = 0;
        this.frameOffset = 0;

        this.peerRenderer = new GameElement(peerParent);
        
        // Show wait screen.
        this.renderer.renderWaitScreen();
        this.peerRenderer.renderWaitScreen();

        this.reconcileIndex = 0;

        this.frameTimes = [];
    }


    startOnline = () => {
        // On receiving 'online-start', sets to start game at the given start time
        this.socket.on('online-start', data => setTimeout( () => {

            // Initalize states (now possible with seed value)
            this.state = new State();
            // Seed random functions
            console.log("randSeeds: ", data.randSeeds);
            this.seeds = data.randSeeds;
            State.setSeed(this.state, data.randSeeds);
            State.setSeed(this.peerStateAt(0), data.randSeeds);
            // Run seed-dependent initializations. 
            Game.initialize(this.state);
            Game.initialize(this.peerStateAt(0));
            Game.start(this.state);
            Game.start(this.peerStateAt(0));
            
            // Lambda to run at the end of countdown
            const onStart = () => {
                // Start listeners
                document.addEventListener('keydown', this.handleKeyDown);
                document.addEventListener('keyup', this.handleKeyUp);
                this.startPeers();
                this.onFrame();
            }

            // Start countdown, set to T-3.
            let countdown = 3;
            const onCountdown = () => {
                this.renderer.renderCountDown(this.state, countdown);
                this.peerRenderer.renderCountDown(this.peerStateAt(0), countdown--);

                if (countdown == 0) {
                    onStart();
                    return;
                }
                setTimeout(onCountdown, 1000);
            };
            setTimeout(onCountdown, 1000);
        }, data.offset));
    }  

    peerInputsAt = (frame) => {
        const index = frame - this.recordIndex;
        // If references a frame not yet created.
        while (index >= this.peerRecord.length) {
            this.peerRecord.push({state: structuredClone(this.peerRecord.at(-1).state), inputs: []});
        }
        return this.peerRecord[index].inputs;
    }
    peerStateAt = (frame) => {
        const index = frame - this.recordIndex;
        // If references a frame not yet created.
        while (index >= this.peerRecord.length) {
            this.peerRecord.push({state: structuredClone(this.peerRecord.at(-1).state), inputs: []});
        }
        return this.peerRecord[index].state;
    }

    startPeers = () => {
        this.socket.on('online-event', data => {
            if (data.from == this.socket.id) return;
            if (data.event == 'heartbeat') return;

            // Logging. If the sent event is at a future frame (caused by slight desynchronizations)
            if (data.frame > this.frameIndex) 
                console.log('online-event data received frame later than current frame');
        
            // Change offset. Assume that the inputs are never sent out-of-order and will not reference a
            // frame already commited to. Remove all records up to the new offset.
            for (let f = this.recordIndex; f < Math.min(this.frameIndex, data.frame-60); f++ ) 
                this.peerRecord.shift();
            this.recordIndex = Math.max(0, Math.min(this.frameIndex, data.frame-60));
            
            // Add to input
            this.peerInputsAt(data.frame).push(data.event);
            //this.peerRecord.at(0).inputs.push(data.event);
            
            // Store where to being reconcilation.
            this.reconcileIndex = Math.min(this.reconcileIndex, data.frame);
        });
    }

    // Overriden from parent 'LocalDriver' to send the input to the server.
    publishEvent = (e) => {
        this.inputs.push(e);
        this.socket.emit('online-event', {event: e, from: this.socket.id, frame: this.frameIndex});
    }

    // Re-compute every frame starting from the changed input. 
    // The 'frame' parameter specifies the frame at which an input was spliced in.
    // i.e. frame +1 will be the first frame reconciled.
    // Stops reconcilation at current frame.
    reconcile = (frame) => {
        for (let f = frame; f < this.frameIndex; f++) {
            const index = f - this.recordIndex;
            const inputs = this.peerInputsAt(f);
            const state = this.peerRecord[index+1].state = structuredClone(this.peerStateAt(f));
        
            // Check if peer accepted garbage
            let shouldSpawnGarbage = false;
            {
                const index = inputs.indexOf('garbage-accept');
                if (index != -1) 
                    shouldSpawnGarbage = true;
            }
            // Recalculate
            Game.process(state, inputs);  
            // Send attacks to local game
            if (state.attack > 0) this.state.garbage.push(state.attack);
            state.attack = 0;
        }
    }

    onFrame = () => {
        const startTime = new Date();
        
        // Local Game
        this.inputsRecord.push(this.inputs);
        Game.process(this.state, this.inputs);
        // Send 'garbage-accept' event if accepted garbage (to sync garbage spawn).
        if (this.state.acceptedGarbage) this.publishEvent('garbage-accept');
        this.state.acceptedGarbage = false;
        this.renderer.renderFrom(this.state);
        this.inputs = [];        

        // Peer Game
        // Reconcile
        this.reconcile(this.reconcileIndex);
        
        const peerInputs = this.peerInputsAt(this.frameIndex);
        const peerNextState = this.peerStateAt(this.frameIndex + 1);
        // Check if garbage accepted
        let shouldSpawnGarbage = false;
        const index = peerInputs.indexOf('garbage-accept');
        if (index != -1) 
            shouldSpawnGarbage = true;
        
        Game.process(peerNextState, peerInputs, shouldSpawnGarbage);
        this.peerRenderer.renderFrom(this.peerStateAt(this.frameIndex +1));
        
        // Player-to-Player interactions, i.e. attacks.
        if (this.state.attack > 0) this.peerStateAt(this.frameIndex + 1).garbage.push(this.state.attack);
        this.state.attack = 0;
        if (peerNextState.attack > 0) this.state.garbage.push(peerNextState.attack);
        peerNextState.attack = 0;

        this.frameIndex ++;
        //document.getElementById('debug').innerText = "" + this.frameIndex;
        this.reconcileIndex = this.frameIndex;

        // Send heartbeat 
        if (this.frameIndex % HEARTBEAT_RATE == 0) this.publishEvent('heartbeat');

        // Frame time log
        if (this.frameIndex < 1000) 
            this.frameTimes.push([startTime, new Date().getTime()]);
        if (this.frameIndex == 1000) 
            console.log(this.frameTimes);
        // Call function again if not over, else render gameover screen
        const timeElapsed = new Date().getTime() - startTime.getTime();
        if (!this.over && !this.state.over && !this.peerStateAt(this.frameIndex).over) {
            setTimeout(this.onFrame, Math.max(0, 1000 / FRAME_RATE - timeElapsed));
        }
    }
}