import { CapturedIndex, SquareIndex } from "@/const";
import { Game } from "../game/game";
import { GameListener } from "../game/gameListener";
import { StateListener } from "../game/stateListner";

export class System {
    private game: Game;

    constructor (
        private readonly gameListner: GameListener,
        private readonly stateListener: StateListener,
        game: Game
    ) {
        this.game = game;
        this.init();
    }

    public getGame() {
        return this.game;
    }

    public getGameListener() {
        return this.gameListner;
    }

    public getStateListener() {
        return this.stateListener;
    }

    // ========================================

    private init() {
        // 初期設定、イベントリスナの登録など
        this.gameListner.onGameEvent((param) => {
            switch (param.type) {
                case 'reset':
                    this.game = Game.createInitialState();
            }
            this.emitViewModel();
        });

        this.gameListner.onClickEvent((param) => {
            switch (param.type) {
                case 'BOARD': {
                    const result = this.game.clickBoard(param.squareIndex);
                    if (result.isErr()) return;
                    this.game = result.value;
                    break;
                } case 'CAPTURED': {
                    const result = this.game.clickCaptured(param.capturedIndex);
                    if (result.isErr()) return;
                    this.game = result.value;
                    break;
                }
            }
            this.emitViewModel();
        });
    }

    private emitViewModel() {
        for (let i = 0; i < 12; i++) {
            this.stateListener.emitSquareViewModel(i as SquareIndex, this.game.getSquareViewModel(i as SquareIndex));
        }

        for (let i = 0; i < 6; i++) {
            this.stateListener.emitCapturedViewModel(i as CapturedIndex, this.game.getCapturedViewModel(i as CapturedIndex));
        }

        this.stateListener.emitSystemViewModel(this.game.getSystemViewModel());
    }
}
