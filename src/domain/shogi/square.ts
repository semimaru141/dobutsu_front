import { EMPTY, Piece, SquareIndex } from "@/const";

export class Square {
    constructor (
        private readonly index: SquareIndex,
        private readonly piece: Piece = EMPTY,
    ) {}

    public getPiece() {
        return this.piece;
    }

    public getIndex() {
        return this.index;
    }

    public isEmpty() {
        return this.piece === EMPTY;
    }

    public setPiece(piece: Piece): Square {
        return new Square(this.index, piece);
    }
}
