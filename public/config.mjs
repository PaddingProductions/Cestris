export const PIECES = ["L", "J", "Z", "S", "I", "O", "T"];
export const PIECE_MAPS = {
    L: [
        [0, 0, 1,
         1, 1, 1,
         0, 0, 0],
        
        [0, 1, 0,
         0, 1, 0, 
         0, 1, 1],
        
        [0, 0, 0, 
         1, 1, 1, 
         1, 0, 0],
        
        [1, 1, 0, 
         0, 1, 0,
         0, 1, 0],
    ],
    J: [
        [1, 0, 0, 
         1, 1, 1, 
         0, 0, 0],
        
        [0, 1, 1, 
         0, 1, 0, 
         0, 1, 0],
        
        [0, 0, 0, 
         1, 1, 1, 
         0, 0, 1],
        
        [0, 1, 0, 
         0, 1, 0, 
         1, 1, 0],
    ],
    Z: [
        
        [1, 1, 0, 
         0, 1, 1, 
         0, 0, 0],
        
        [0, 0, 1, 
         0, 1, 1, 
         0, 1, 0],
        
        [0, 0, 0, 
         1, 1, 0, 
         0, 1, 1],
        
        [0, 1, 0, 
         1, 1, 0, 
         1, 0, 0],
    ],
    S: [
        
        [0, 1, 1,
         1, 1, 0, 
         0, 0, 0],
        
        [0, 1, 0, 
         0, 1, 1, 
         0, 0, 1],
        
        [0, 0, 0, 
         0, 1, 1, 
         1, 1, 0],

        [1, 0, 0, 
         1, 1, 0, 
         0, 1, 0],
    ],
    I: [
        [0, 0, 0, 0, 0, 
         0, 0, 0, 0, 0,
         0, 1, 1, 1, 1, 
         0, 0, 0, 0, 0, 
         0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0,
         0, 0, 1, 0, 0,
         0, 0, 1, 0, 0, 
         0, 0, 1, 0, 0, 
         0, 0, 1, 0, 0],
        
        [0, 0, 0, 0, 0,
         0, 0, 0, 0, 0,
         1, 1, 1, 1, 0,
         0, 0, 0, 0, 0,
         0, 0, 0, 0, 0],
        
        [0, 0, 1, 0, 0,
         0, 0, 1, 0, 0,
         0, 0, 1, 0, 0,
         0, 0, 1, 0, 0,
         0, 0, 0, 0, 0],
    ],
    O: [
        [0, 1, 1,
         0, 1, 1,
         0, 0, 0],

        [0, 0, 0, 
         0, 1, 1, 
         0, 1, 1],

        [0, 0, 0,
         1, 1, 0, 
         1, 1, 0],

        [1, 1, 0, 
         1, 1, 0,
         0, 0, 0],
    ],
    T: [
        [0, 1, 0, 
         1, 1, 1, 
         0, 0, 0],

        [0, 1, 0, 
         0, 1, 1,
         0, 1, 0],

        [0, 0, 0, 
         1, 1, 1, 
         0, 1, 0],

        [0, 1, 0,
         1, 1, 0, 
         0, 1, 0],
    ],
};
export const KICK_TABLE = [
    [
        [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ],
        [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
        ],
        [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ],
        [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: 2 },
            { x: -1, y: 2 },
        ],
    ],
    [
        [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 2, y: 0 },
            { x: -1, y: 0 },
            { x: 2, y: 0 },
        ],
        [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -2 },
        ],
        [
            { x: -1, y: 1 },
            { x: 1, y: 1 },
            { x: -2, y: 1 },
            { x: 1, y: 0 },
            { x: -2, y: 0 },
        ],
        [
            { x: 0, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 0, y: 2 },
        ],
    ],
    [[[0, 0]], [[0, -1]], [[-1, -1]], [[-1, 0]]],
];
export const PIECE_COLOR = {
    L: "#e09334",
    J: "#3c34e0",
    Z: "#d93e36",
    S: "#48db57",
    I: "#46dee3",
    O: "#ede04a",
    T: "#aa48db",
    garbage: "#444",
};
export const GARBAGE_CAP = 12;
export const ATTACK_MAP = {
    single: 0,
    double: 1,
    triple: 2,
    tetris: 4,

    "tspin single": 2,
    "tspin double": 4,
    "tspin triple": 6,
};
export const COMBO_TABLE = [0, 0, 1, 1, 2, 2, 3, 3, 3, 4];
export const B2B_LEVELS = [0, 2, 7, 23, 66];
export const B2B_CLEARS = [
    "tetris",
    "tspin single",
    "tspin double",
    "tspin triple",
];

export const SOFT_DROP_SPEED = 10;
export const GRAVITY_SPEED = 0;
export const TICK_LIMIT = 10;
export const LOCK_LIMIT = Math.max(TICK_LIMIT, 200);

export const DAS_LIMIT = 8;
export const ARR_LIMIT = 0;

export const SIZE = 20;

export const FRAME_RATE = 60;
export const HEARTBEAT_RATE = 60;
