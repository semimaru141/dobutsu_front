import { EMPTY, Piece, SquareIndex } from "@/const";
import { isEmpty } from "@/util/pieceFunc";

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
        return isEmpty(this.piece);
    }

    public isPieceExists() {
        return !this.isEmpty();
    }

    public setPiece(piece: Piece): Square {
        return new Square(this.index, piece);
    }

    public getKey(): string {
        return this.piece !== 10 ? this.piece.toString() : 'a';
    }
}
