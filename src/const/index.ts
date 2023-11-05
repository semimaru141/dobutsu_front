// board
export const EMPTY = 0
export const MY_LION_NUM = 1
export const MY_ELE_NUM = 2
export const MY_GIR_NUM = 3
export const MY_CHICK_NUM = 4
export const MY_HEN_NUM = 5

export const OP_LION_NUM = 6
export const OP_ELE_NUM = 7
export const OP_GIR_NUM = 8
export const OP_CHICK_NUM = 9
export const OP_HEN_NUM = 10


export type MyPiece = typeof MY_LION_NUM | typeof MY_ELE_NUM | typeof MY_GIR_NUM | typeof MY_CHICK_NUM | typeof MY_HEN_NUM;
export type OpPiece = typeof OP_LION_NUM | typeof OP_ELE_NUM | typeof OP_GIR_NUM | typeof OP_CHICK_NUM | typeof OP_HEN_NUM;
export type Piece = typeof EMPTY | MyPiece | OpPiece;

// captured
export const MY_ELE_INDEX = 0
export const MY_GIR_INDEX = 1
export const MY_CHICK_INDEX = 2

export const OP_ELE_INDEX = 3
export const OP_GIR_INDEX = 4
export const OP_CHICK_INDEX = 5

export type MyCapturedIndex = typeof MY_ELE_INDEX | typeof MY_GIR_INDEX | typeof MY_CHICK_INDEX;
export type OpCapturedIndex = typeof OP_ELE_INDEX | typeof OP_GIR_INDEX | typeof OP_CHICK_INDEX;
export type CapturedIndex = MyCapturedIndex | OpCapturedIndex;

export const INITIAL_BOARD = [
    OP_GIR_NUM, OP_LION_NUM, OP_ELE_NUM, 
    EMPTY, OP_CHICK_NUM, EMPTY, 
    EMPTY, MY_CHICK_NUM, EMPTY,
    MY_ELE_NUM, MY_LION_NUM, MY_GIR_NUM
] as const
export const INITIAL_CAPTURED = [0, 0, 0, 0, 0, 0] as const

export type SquareIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Player = 'ME' | 'OPPONENT';
export type PlayStrategy = 'CLICK' | 'STRATEGY';

export type ReverseTemperature = number;
export const MIN_REVERSE_TEMPERATURE = 0;
export const MAX_REVERSE_TEMPERATURE = 1000;
export const DEFAULT_REVERSE_TEMPERATURE = MAX_REVERSE_TEMPERATURE;

export const KEY_VALIDATOR = /([0-9]|a){12}[0-2]{6}/

export const BASE_PATH = '/dobutsu_front'
