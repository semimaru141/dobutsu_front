import { CapturedIndex, MyPiece, OpPiece, Piece, SquareIndex } from "@/const";
import { isMyCaptured, isOpCaptured } from "@/util/capturedFunc";
import { isMyPiece, isOpPiece } from "@/util/pieceFunc";
import { err, ok, Result } from "neverthrow";

export type Turn = 'ME' | 'OPPONENT';

type BoardAction = {
    type: 'BOARD',
    piece: Piece,
    squareIndex: SquareIndex,
}
type CapturedAction = {
    type: 'CAPTURED',
    capturedIndex: CapturedIndex,
}
type NoneAction = {
    type: 'NONE'
}
export type SelectingAction = BoardAction | CapturedAction | NoneAction;

/**
 * Gameの状態についてのクラス
 * 「自分の手番・相手の手番の状態」と選択中のマスの情報を持つ
 */
export class GameState {
    constructor(
        /**
         * 自分の手番かどうか
         */
        private turn: Turn,
        /**
         * 選択中のマスの
         */
        private selectingAction: SelectingAction = { type: 'NONE' },
    ) {}

    static createInitialState() {
        return new GameState('ME');
    }

    public getTurn() {
        return this.turn;
    }

    /**
     * 手番を切り替える
     * 選択中のアクションはクリアされる
     */
    public toggleTurn() {
        return new GameState(this.turn === 'ME' ? 'OPPONENT' : 'ME');
    }

    public getSelectingAction() {
        return this.selectingAction;
    }

    public setSelectingAction(selectiongAction: SelectingAction): Result<GameState, Error> {
        switch (selectiongAction.type) {
            case 'BOARD': {
                const result = this.boardValidateion(selectiongAction);
                if (result.isErr()) return err(result.error);
                return ok(new GameState(this.turn, selectiongAction));
            } case 'CAPTURED': {
                const result = this.capturedValidateion(selectiongAction);
                if (result.isErr()) return err(result.error);
                return ok(new GameState(this.turn, selectiongAction));
            } case 'NONE': {
                return ok(new GameState(this.turn, selectiongAction));
            }
        }
    }

    public clearSelectingAction() {
        return new GameState(this.turn, { type: 'NONE' });
    }

    // ========================================

    private boardValidateion(boardAction: BoardAction): Result<unknown, Error> {
        if (this.turn === 'ME') {
            return isMyPiece(boardAction.piece) ? ok(undefined) : err(new Error());
        } else {
            return isOpPiece(boardAction.piece) ? ok(undefined) : err(new Error());
        }
    }

    private capturedValidateion(capturedAction: CapturedAction): Result<unknown, Error> {
        if(this.turn === 'ME') {
            return isMyCaptured(capturedAction.capturedIndex) ? ok(undefined) : err(new Error());
        } else {
            return isOpCaptured(capturedAction.capturedIndex) ? ok(undefined) : err(new Error());
        }
    }
}
