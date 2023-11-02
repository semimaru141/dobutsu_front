import { CapturedIndex, EMPTY, INITIAL_BOARD, INITIAL_CAPTURED, MyCapturedIndex, MyPiece, MY_CHICK_INDEX, MY_CHICK_NUM, MY_ELE_INDEX, MY_ELE_NUM, MY_GIR_INDEX, MY_GIR_NUM, MY_HEN_NUM, MY_LION_NUM, OpPiece, OP_CHICK_NUM, OP_ELE_INDEX, OP_ELE_NUM, OP_GIR_NUM, OP_HEN_NUM, OP_LION_NUM, Piece, SquareIndex } from "@/const";
import { err, ok, Result } from "neverthrow";
import { Captured } from "./captured";
import { Square } from "./square";

export class ShogiState {
    constructor(
        private readonly board: Square[],
        private readonly captured: Captured[],
    ) {}

    static createInitialState(): ShogiState {
        const initial_board = INITIAL_BOARD.map((piece, index) => new Square(index as SquareIndex, piece));
        const initial_captured = INITIAL_CAPTURED.map((amount, index) => new Captured(index as CapturedIndex, amount));
        return new ShogiState(initial_board, initial_captured);
    }

    public getKey(): string {
        return '000000000000000000';
    }

    public getPiece(squareIndex: SquareIndex): Piece {
        return this.board[squareIndex].getPiece();
    }

    public getAmount(capturedIndex: CapturedIndex): number {
        return this.captured[capturedIndex].getAmount();
    }

    public movePiece(from: SquareIndex, to: SquareIndex): Result<ShogiState, Error> {
        const fromSquare = this.board[from];
        const toSquare = this.board[to];
        const newFromSquare = fromSquare.setPiece(EMPTY);
        const newToSquare = toSquare.setPiece(fromSquare.getPiece());

        // 移動可能か判定
        const canMoveResult = this.canMovePiece(fromSquare.getPiece() as MyPiece, from, to);

        // 駒を動かした後の駒台
        const newCapturedResult = (() => {
            if (!toSquare.isEmpty() && toSquare.getPiece() !== OP_LION_NUM) {
                return this.catchPiece(toSquare.getPiece() as OpPiece);
            } else {
                return ok(this.captured);
            }
        })()

        // 駒を動かした後の盤面
        const newBoardResult = (() => {
            const newBoard = [...this.board];
            newBoard[from] = newFromSquare;

            // 成り判定
            if (fromSquare.getPiece() === MY_CHICK_NUM && to < 3) {
                newBoard[to] = newToSquare.setPiece(MY_HEN_NUM);
            } else {
                newBoard[to] = newToSquare;
            }
            return ok(newBoard);
        })()

        return Result.combine([canMoveResult, newBoardResult, newCapturedResult])
        .map(([_, newBoard, newCaptured]) => new ShogiState(newBoard, newCaptured));
    }

    public putPiece(capturedIndex: MyCapturedIndex, to: SquareIndex): Result<ShogiState, Error> {
        const newCapturedResult = this.useCaptured(capturedIndex);

        const toSquare = this.board[to];
        if (!toSquare.isEmpty()) return err(new Error());
        
        const newBoardResult = (() => {
            const piece = (() => {
                switch (capturedIndex) {
                    case MY_ELE_INDEX:
                        return MY_ELE_NUM;
                    case MY_GIR_INDEX:
                        return MY_GIR_NUM;
                    case MY_CHICK_INDEX:
                        return MY_CHICK_NUM;
                }
            })()
            if(piece === undefined) return err(new Error());

            const newBoard = [...this.board];
            newBoard[to] = toSquare.setPiece(piece);
            return ok(newBoard);
        })()

        return Result.combine([newBoardResult, newCapturedResult])
        .map(([newBoard, newCaptured]) => new ShogiState(newBoard, newCaptured));
    }

    public canMovePiece(piece: MyPiece, from: SquareIndex, to: SquareIndex): Result<unknown, Error> {
        const toSquare = this.board[to];
        if (toSquare.getPiece() > EMPTY && toSquare.getPiece() < OP_LION_NUM) return err(new Error());

        const moves = ShogiState.getMove(piece, from);
        if (moves.includes(to)) {
            return ok(undefined);
        } else {
            return err(new Error());
        }
    }

    public getNextStates(): ShogiState[] {
        // TODO: ここで次の状態を返す
        return [];
    }

    // ====================

    /**
     * 相手の駒を取った時の処理
     * @param piece 取った駒
     * @returns 取った後の駒台
     */
    private catchPiece(piece: OpPiece): Result<Captured[], Error> {
        const targetCapturedIndex = ((): MyCapturedIndex | undefined => {
            switch (piece) {
                case OP_ELE_NUM:
                    return MY_ELE_INDEX;
                case OP_GIR_NUM:
                    return MY_GIR_INDEX;
                case OP_CHICK_NUM:
                    return MY_CHICK_INDEX;
                case OP_HEN_NUM:
                    return MY_CHICK_INDEX;
            }
        })()
        if (targetCapturedIndex === undefined) return err(new Error());

        // 取ったコマを駒台に追加
        const targetCaptured = this.captured[targetCapturedIndex];
        const newCaptured = targetCaptured.setAmount(targetCaptured.getAmount() + 1);
        return ok([...this.captured.slice(0, targetCapturedIndex), newCaptured, ...this.captured.slice(targetCapturedIndex + 1)]);
    }

    /**
     * 駒を使用する時の処理
     * @param capturedIndex 使用しようとしている駒台のインデックス 
     * @returns 使用した後の駒台
     */
    private useCaptured(capturedIndex: MyCapturedIndex): Result<Captured[], Error> {
        const targetCaptured = this.captured[capturedIndex];
        const targetAmount = targetCaptured.getAmount();
        if (targetAmount === 0) return err(new Error());
        const newCaptured = targetCaptured.setAmount(targetAmount - 1);
        return ok([...this.captured.slice(0, capturedIndex), newCaptured, ...this.captured.slice(capturedIndex + 1)]);
    }

    /**
     * 駒の移動可能なマスを取得する
     * @param piece 移動する駒
     * @param squareIndex 移動元のマス
     * @returns 移動可能なマスのインデックス
     */
    private static getMove(piece: MyPiece, squareIndex: SquareIndex): SquareIndex[] {
        const moveDiffs = ((): number[] => {
            switch (piece) {
                case MY_CHICK_NUM:
                    if (squareIndex > 3) return [-3];
                    else return [];
                case MY_LION_NUM:
                    if (squareIndex === 0) return [1, 3, 4];
                    else if (squareIndex === 1) return [-1, 1, 2, 3, 4];
                    else if (squareIndex === 2) return [-1, 2, 3];
                    else if (squareIndex === 3 || squareIndex === 6) return [-3, -2, 1, 3, 4];
                    else if (squareIndex === 4 || squareIndex === 7) return [-4, -3, -2, -1, 1, 2, 3, 4];
                    else if (squareIndex === 5 || squareIndex === 8) return [-4, -3, -1, 2, 3];
                    else if (squareIndex === 9) return [-3, -2, 1];
                    else if (squareIndex === 10) return [-4, -3, -2, -1, 1];
                    else if (squareIndex === 11) return [-4, -3, -1];
                case MY_ELE_NUM:
                    if (squareIndex === 0) return [4];
                    else if (squareIndex === 1) return [2, 4];
                    else if (squareIndex === 2) return [2];
                    else if (squareIndex === 3 || squareIndex === 6) return [-2, 4];
                    else if (squareIndex === 4 || squareIndex === 7) return [-4, -2, 2, 4];
                    else if (squareIndex === 5 || squareIndex === 8) return [-4, 2];
                    else if (squareIndex === 9) return [-2];
                    else if (squareIndex === 10) return [-4, -2];
                    else if (squareIndex === 11) return [-4];
                case MY_GIR_NUM:
                    if (squareIndex === 0) return [1, 3];
                    else if (squareIndex === 1) return [-1, 1, 3];
                    else if (squareIndex === 2) return [-1, 3];
                    else if (squareIndex === 3 || squareIndex === 6) return [-3, 1, 3];
                    else if (squareIndex === 4 || squareIndex === 7) return [-3, -1, 1, 3];
                    else if (squareIndex === 5 || squareIndex === 8) return [-3, -1, 3];
                    else if (squareIndex === 9) return [-3, 1];
                    else if (squareIndex === 10) return [-3, -1, 1];
                    else if (squareIndex === 11) return [-3, -1];
                case MY_HEN_NUM:
                    if (squareIndex === 0) return [1, 3];
                    else if (squareIndex === 1) return [-1, 1, 3];
                    else if (squareIndex === 2) return [-1, 3];
                    else if (squareIndex === 3 || squareIndex === 6) return [-3, -2, 1, 3];
                    else if (squareIndex === 4 || squareIndex === 7) return [-4, -3, -2, -1, 1, 3];
                    else if (squareIndex === 5 || squareIndex === 8) return [-4, -3, -1, 3];
                    else if (squareIndex === 9) return [-3, -2, 1];
                    else if (squareIndex === 10) return [-4, -3, -2, -1, 1];
                    else if (squareIndex === 11) return [-4, -3, -1];
            }
            return [];
        })();
        return moveDiffs.map(diff => squareIndex + diff as SquareIndex);
    }
}
