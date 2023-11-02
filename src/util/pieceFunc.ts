import { EMPTY, MyPiece, MY_LION_NUM, OpPiece, OP_LION_NUM, Piece } from "@/const";

export const isMyPiece = (piece: Piece): piece is MyPiece => {
    return piece !== EMPTY && piece < OP_LION_NUM;
}

export const isOpPiece = (piece: Piece): piece is OpPiece => {
    return piece >= OP_LION_NUM;
}

export const isEmpty = (piece: Piece): piece is typeof EMPTY => {
    return piece === EMPTY;
}

export const isLion = (piece: Piece): boolean => {
    return piece === MY_LION_NUM || piece === OP_LION_NUM;
}
