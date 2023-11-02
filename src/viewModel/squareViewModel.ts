import { Piece, SquareIndex } from "@/const";

export const squareStates = ['clickable', 'selecting', 'inclickable'] as const;
export type SquareState = typeof squareStates[number];

export type SquareViewModel = {
    squareIndex: SquareIndex;
    piece: Piece;
    state: SquareState;
}
