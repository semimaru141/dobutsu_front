import { CapturedIndex, Piece, Player, SquareIndex } from "@/const";
import { isMyCaptured, isOpCaptured } from "@/util/capturedFunc";
import { isMyPiece, isOpPiece } from "@/util/pieceFunc";
import { err, ok, Result } from "neverthrow";

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

type NotFinish = {
    type: 'NOTFINISH',
}
type Finished = {
    type: 'FINISHED',
    winner: Player,
}
export type FinishStatus = NotFinish | Finished;

type PlayType = "CLICK" | "STRATEGY";
type PlayTypeStatus = {
    me: PlayType,
    opponent: PlayType,
}

/**
 * Gameの状態についてのクラス
 * 「自分の手番・相手の手番の状態」と選択中のマスの情報を持つ
 */
export class GameState {
    constructor(
        /**
         * 先手・後手の操作方法
         */
        private playTypeStatus: PlayTypeStatus,
        /**
         * 自分の手番かどうか
         */
        private turnPlayer: Player,
        /**
         * 選択中のマスの
         */
        private selectingAction: SelectingAction = { type: 'NONE' },
        /**
         * ゲームが終了しているかどうか
         */
        private finishStatus: FinishStatus = { type: 'NOTFINISH' }
    ) {}

    static createInitialState() {
        return new GameState({
            me: 'STRATEGY',
            opponent: 'STRATEGY',
        }, 'ME');
    }

    public getTurnPlayer() {
        return this.turnPlayer;
    }

    /**
     * 手番を切り替える
     * 選択中のアクションはクリアされる
     */
    public toggleTurn() {
        return new GameState(this.playTypeStatus, this.turnPlayer === 'ME' ? 'OPPONENT' : 'ME');
    }

    public getSelectingAction() {
        return this.selectingAction;
    }

    public isFinished() {
        return this.finishStatus.type === 'FINISHED';
    }

    public getWinner(): Result<Player, Error> {
        if (this.finishStatus.type === 'NOTFINISH') return err(new Error());
        return ok(this.finishStatus.winner);
    }

    public getPlayTypeStatus(): PlayType {
        switch (this.turnPlayer) {
            case 'ME': return this.playTypeStatus.me;
            case 'OPPONENT': return this.playTypeStatus.opponent;
        }
    }

    public setFinishStatus(winner: Player) {
        return new GameState(this.playTypeStatus, this.turnPlayer, this.selectingAction, { type: 'FINISHED', winner });
    }

    public setSelectingAction(selectiongAction: SelectingAction): Result<GameState, Error> {
        if (this.isFinished()) return err(new Error());

        switch (selectiongAction.type) {
            case 'BOARD': {
                const result = this.boardValidateion(selectiongAction);
                if (result.isErr()) return err(result.error);
                return ok(new GameState(this.playTypeStatus, this.turnPlayer, selectiongAction));
            } case 'CAPTURED': {
                const result = this.capturedValidateion(selectiongAction);
                if (result.isErr()) return err(result.error);
                return ok(new GameState(this.playTypeStatus, this.turnPlayer, selectiongAction));
            } case 'NONE': {
                return ok(new GameState(this.playTypeStatus, this.turnPlayer, selectiongAction));
            }
        }
    }

    public clearSelectingAction() {
        return new GameState(this.playTypeStatus, this.turnPlayer, { type: 'NONE' });
    }

    // ========================================

    private boardValidateion(boardAction: BoardAction): Result<unknown, Error> {
        if (this.turnPlayer === 'ME') {
            return isMyPiece(boardAction.piece) ? ok(undefined) : err(new Error());
        } else {
            return isOpPiece(boardAction.piece) ? ok(undefined) : err(new Error());
        }
    }

    private capturedValidateion(capturedAction: CapturedAction): Result<unknown, Error> {
        if(this.turnPlayer === 'ME') {
            return isMyCaptured(capturedAction.capturedIndex) ? ok(undefined) : err(new Error());
        } else {
            return isOpCaptured(capturedAction.capturedIndex) ? ok(undefined) : err(new Error());
        }
    }
}
