import { CapturedIndex, EMPTY, INITIAL_BOARD, INITIAL_CAPTURED, KEY_VALIDATOR, MyCapturedIndex, MyPiece, MY_CHICK_INDEX, MY_CHICK_NUM, MY_ELE_INDEX, MY_ELE_NUM, MY_GIR_INDEX, MY_GIR_NUM, MY_HEN_NUM, MY_LION_NUM, OpPiece, OP_CHICK_INDEX, OP_CHICK_NUM, OP_ELE_INDEX, OP_ELE_NUM, OP_GIR_INDEX, OP_GIR_NUM, OP_HEN_NUM, OP_LION_NUM, Piece, Player, SquareIndex } from "@/const";
import { isMyCaptured, isOpCaptured } from "@/util/capturedFunc";
import { keyValidation } from "@/util/keyValidation";
import { isEmpty, isLion, isMyPiece, isOpPiece } from "@/util/pieceFunc";
import { err, ok, Result } from "neverthrow";
import { Captured } from "./captured";
import { Square } from "./square";

export class ShogiState {
    constructor(
        private readonly board: Square[],
        private readonly captured: Captured[],
    ) {}

    public static createInitialState(): ShogiState {
        const initial_board = INITIAL_BOARD.map((piece, index) => new Square(index as SquareIndex, piece));
        const initial_captured = INITIAL_CAPTURED.map((amount, index) => new Captured(index as CapturedIndex, amount));
        return new ShogiState(initial_board, initial_captured);
    }

    public static parseKey(key: string): Result<ShogiState, Error> {
        const boardKey = key.slice(0, 12);
        const capturedKey = key.slice(12);
        const board = boardKey
            .split('')
            .map((piece, index) => new Square(index as SquareIndex, piece !== 'a' ? Number(piece) as Piece : 10));
        const captured = capturedKey
            .split('')
            .map((amount, index) => new Captured(index as CapturedIndex, Number(amount)));
        return keyValidation(key).map(() => new ShogiState(board, captured));
    }

    public getKey(): string {
        const boardKey = this.board.map(square => square.getKey()).join('');
        const capturedKey = this.captured.map(captured => captured.getKey()).join('');
        return boardKey + capturedKey;
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
        const canMoveResult = this.canMovePiece(fromSquare.getPiece(), from, to);

        // 駒を動かした後の駒台
        const newCapturedResult = (() => {
            if(toSquare.isEmpty() || isLion(toSquare.getPiece())) return ok(this.captured);
            return this.catchPiece(toSquare.getPiece());
        })()

        // 駒を動かした後の盤面
        const newBoardResult = (() => {
            const newBoard = [...this.board];
            newBoard[from] = newFromSquare;

            // 成り判定
            if (fromSquare.getPiece() === MY_CHICK_NUM && to < 3) {
                newBoard[to] = newToSquare.setPiece(MY_HEN_NUM);
            } else if (fromSquare.getPiece() === OP_CHICK_NUM && to > 8) {
                newBoard[to] = newToSquare.setPiece(OP_HEN_NUM);
            } else {
                newBoard[to] = newToSquare;
            }
            return ok(newBoard);
        })()

        return Result.combine([canMoveResult, newBoardResult, newCapturedResult])
        .map(([_, newBoard, newCaptured]) => new ShogiState(newBoard, newCaptured));
    }

    public putPiece(capturedIndex: CapturedIndex, to: SquareIndex): Result<ShogiState, Error> {
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
                    case OP_ELE_INDEX:
                        return OP_ELE_NUM;
                    case OP_GIR_INDEX:
                        return OP_GIR_NUM;
                    case OP_CHICK_INDEX:
                        return OP_CHICK_NUM;
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

    public canMovePiece(piece: Piece, from: SquareIndex, to: SquareIndex): Result<unknown, Error> {
        const toSquare = this.board[to];
        
        if (isEmpty(piece)) return err(new Error());
        if (isMyPiece(piece) && isMyPiece(toSquare.getPiece())) return err(new Error());
        if (isOpPiece(piece) && isOpPiece(toSquare.getPiece())) return err(new Error());

        const moves = ShogiState.getMove(piece, from);
        if (moves.includes(to)) {
            return ok(undefined);
        } else {
            return err(new Error());
        }
    }

    public getNextStates(turnPlayer: Player): ShogiState[] {
        const pieceFunc = turnPlayer === 'ME' ? isMyPiece : isOpPiece;
        const boardStates = this.board.map((square, index) => {
            return pieceFunc(square.getPiece()) ?
                Array(12).fill(undefined).map((_, i) => {
                    const result = this.movePiece(index as SquareIndex, i as SquareIndex);
                    if (result.isOk()) return [result.value];
                    else return [];
                }).flat() :
                [];
        }).flat();

        const capturedFunc = turnPlayer === 'ME' ? isMyCaptured : isOpCaptured;
        const capturedStates = this.captured.map((captured, index) => {
            return capturedFunc(index as CapturedIndex) && captured.getAmount() !== 0 ?
                Array(12).fill(undefined).map((_, i) => {
                    const result = this.putPiece(index as CapturedIndex, i as SquareIndex);
                    if (result.isOk()) return [result.value];
                    else return [];
                }).flat() :
                [];
        }).flat();

        return [...boardStates, ...capturedStates];
    }

    public isFinished(turnPlayer: Player): {
        isFinished: true,
        winner: Player
    } | {
        isFinished: false
    } {
        const myWin: {
            isFinished: true,
            winner: Player
        } = {
            isFinished: true,
            winner: 'ME',
        }
        const opWin: {
            isFinished: true,
            winner: Player
        } = {
            isFinished: true,
            winner: 'OPPONENT',
        }

        const myLionSquareIndex = this.board.findIndex(square => square.getPiece() === MY_LION_NUM);
        const opLionSquareIndex = this.board.findIndex(square => square.getPiece() === OP_LION_NUM);
        if(myLionSquareIndex === -1) {
            return opWin;
        } else if(opLionSquareIndex === -1) {
            return myWin;
        }

        if (turnPlayer === 'ME' && myLionSquareIndex < 3) {
            return myWin;
        } else if (turnPlayer === 'OPPONENT' && opLionSquareIndex > 8) {
            return opWin;
        }

        return {
            isFinished: false,
        }
    }

    public turnState(): ShogiState {
        const newBoard = this.board.reverse().map(square => square.turnState());
        const newCaptured = [...this.captured.slice(0, 3), ...this.captured.slice(3)]
        return new ShogiState(newBoard, newCaptured);
    }

    // ====================

    /**
     * 相手の駒を取った時の処理
     * @param piece 取った駒
     * @returns 取った後の駒台
     */
    private catchPiece(piece: Piece): Result<Captured[], Error> {
        const targetCapturedIndex = ((): CapturedIndex | undefined => {
            switch (piece) {
                case OP_ELE_NUM:
                    return MY_ELE_INDEX;
                case OP_GIR_NUM:
                    return MY_GIR_INDEX;
                case OP_CHICK_NUM:
                    return MY_CHICK_INDEX;
                case OP_HEN_NUM:
                    return MY_CHICK_INDEX;
                case MY_ELE_NUM:
                    return OP_ELE_INDEX;
                case MY_GIR_NUM:
                    return OP_GIR_INDEX;
                case MY_CHICK_NUM:
                    return OP_CHICK_INDEX;
                case MY_HEN_NUM:
                    return OP_CHICK_INDEX;
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
    private useCaptured(capturedIndex: CapturedIndex): Result<Captured[], Error> {
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
    private static getMove(piece: MyPiece | OpPiece, squareIndex: SquareIndex): SquareIndex[] {
        const moveDiffs = ((): number[] => {
            switch (piece) {
                case MY_CHICK_NUM:
                    if (squareIndex > 2) return [-3];
                    else return [];
                case OP_CHICK_NUM:
                    if (squareIndex < 9) return [3];
                    else return [];
                case MY_LION_NUM:
                case OP_LION_NUM:
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
                case OP_ELE_NUM:
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
                case OP_GIR_NUM:
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
                case OP_HEN_NUM:
                    if (squareIndex === 0) return [1, 3, 4];
                    else if (squareIndex === 1) return [-1, 1, 2, 3, 4];
                    else if (squareIndex === 2) return [-1, 2, 3];
                    else if (squareIndex === 3 || squareIndex === 6) return [-3, 1, 3, 4];
                    else if (squareIndex === 4 || squareIndex === 7) return [-3, -1, 1, 2, 3, 4];
                    else if (squareIndex === 5 || squareIndex === 8) return [-3, -1, 2, 3];
                    else if (squareIndex === 9) return [-3, 1];
                    else if (squareIndex === 10) return [-3, -1, 1];
                    else if (squareIndex === 11) return [-3, -1];
            }
            return [];
        })();
        return moveDiffs.map(diff => squareIndex + diff as SquareIndex);
    }
}
