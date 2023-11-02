import { CapturedIndex, SquareIndex } from "@/const";

export type Turn = 'ME' | 'OPPONENT';
export type SelectingAction = {
    type: 'BOARD',
    squareIndex: SquareIndex,
} | {
    type: 'CAPTURED',
    capturedIndex: CapturedIndex,
} | {
    type: 'NONE'
}


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

    public toggleTurn() {
        return new GameState(this.turn === 'ME' ? 'OPPONENT' : 'ME');
    }

    public getSelectingAction() {
        return this.selectingAction;
    }

    public setSelectingAction(selectiongAction: SelectingAction): GameState {
        return new GameState(this.turn, selectiongAction);
    }
}
