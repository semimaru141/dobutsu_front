import { CapturedIndex, SquareIndex } from "@/const";
import { Game } from "../game/game";
import { GameListener } from "../game/gameListener";
import { StateListener } from "../game/stateListner";
import { Model } from "../model/model";
import { ModelListener } from "../model/modelListener";

const STRATEGY_INTARVAL_MILLI_SEC = 1000;

export class System {
    private game: Game;
    private model: Model | undefined = undefined;

    constructor (
        private readonly gameListner: GameListener,
        private readonly stateListener: StateListener,
        private readonly modelListener: ModelListener,
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

    public setModel(model: Model) {
        this.model = model;
    }

    // ========================================

    private init() {
        // 初期設定、イベントリスナの登録など
        this.gameListner.onGameEvent((param) => {
            switch (param.type) {
                case 'reset':
                    this.game = Game.createInitialState();
            }
            this.emitEvents();
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
            this.emitEvents();
        });

        this.modelListener.onStrategyEvent((params) => {
            const model = this.model;
            if (model === undefined) {
                setTimeout(() => {
                    this.modelListener.emitStrategyEvent(params);
                }, STRATEGY_INTARVAL_MILLI_SEC);
                return;
            }

            const strategy = params.turnPlayer === 'ME' ? model.getChooseMaxStrategy() : model.getChooseMinStrategy();
            const result = this.game.selectNextState(strategy);
            if (result.isErr()) return;
            this.game = result.value;

            this.emitEvents();
        });
    }

    private emitEvents() {
        for (let i = 0; i < 12; i++) {
            this.stateListener.emitSquareViewModel(i as SquareIndex, this.game.getSquareViewModel(i as SquareIndex));
        }

        for (let i = 0; i < 6; i++) {
            this.stateListener.emitCapturedViewModel(i as CapturedIndex, this.game.getCapturedViewModel(i as CapturedIndex));
        }

        this.stateListener.emitSystemViewModel(this.game.getSystemViewModel());
        
        if (this.game.isTurnForStrategy() && !this.game.isFinished()) {
            setTimeout(() => {
                this.modelListener.emitStrategyEvent({
                    turnPlayer: this.game.getTurnPlayer(),
                });
            }, STRATEGY_INTARVAL_MILLI_SEC)
        }
    }
}
