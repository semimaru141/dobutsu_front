import { EMPTY, Piece, SquareIndex } from "@/const";
import { isEmpty, isMyPiece } from "@/util/pieceFunc";

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

    public turnState(): Square {
        const turnedState = (isEmpty(this.piece) ? EMPTY : isMyPiece(this.piece) ? this.piece + 5 : this.piece - 5) as Piece;
        return new Square(this.index, turnedState);
    }
}
