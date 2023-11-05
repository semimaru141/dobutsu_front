import { CapturedIndex, Player, SquareIndex } from "@/const";
import { ModelName } from "@/const/model";
import { CapturedViewModel } from "@/viewModel/capturedViewModel";
import { SquareViewModel } from "@/viewModel/squareViewModel";
import { SystemViewModel } from "@/viewModel/systemViewModel";
import { Result } from "neverthrow";
import { Game } from "../game/game";
import { GameListener } from "../game/gameListener";
import { StateListener } from "../game/stateListner";
import { Model } from "../model/model";
import { ModelListener } from "../model/modelListener";
import { PlayType } from "../playType/playType";

const STRATEGY_INTARVAL_MILLI_SEC = 1500;

export class System {
    private game: Game;
    private playTypes: {
        me: PlayType,
        opponent: PlayType,
    }
    private models: Map<ModelName, Model> = new Map();
    private notStarted = true;

    constructor (
        private readonly gameListner: GameListener,
        private readonly stateListener: StateListener,
        private readonly modelListener: ModelListener,
        game: Game,
        me: PlayType,
        opponent: PlayType,
    ) {
        this.game = game;
        this.playTypes = {
            me,
            opponent,
        };
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
                case 'start': {
                    this.game = Game.createInitialState();

                    const loadModelHandler = (result: Result<ModelName, Error>) => {
                        if (result.isOk()) {
                            this.loadModel(result.value);
                        }
                    }
                    
                    loadModelHandler(param.playType.me.getModelName());
                    loadModelHandler(param.playType.opponent.getModelName());

                    this.playTypes = param.playType;

                    break;
                } case 'reset': {
                    this.game = Game.createInitialState();
                    break;
                }
            }
            this.notStarted = false;
            this.emitEvents();
        });

        this.gameListner.onClickEvent((param) => {
            // ゲーム開始前はクリックイベントを無視する
            if (this.notStarted) return;

            // AIの手番の場合はクリックイベントを無視する
            if (this.getPlayType(this.game.getTurnPlayer()).getPlayStrategy() === 'STRATEGY') return;

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
            const playType = this.getPlayType(params.turnPlayer);
            const modelNameResult = playType.getModelName();
            if (modelNameResult.isErr()) return;
            const modelName = modelNameResult.value;

            const reverseTemperatureResult = playType.getReverseTemperature();
            if (reverseTemperatureResult.isErr()) return;
            const reverseTemperature = reverseTemperatureResult.value;

            const model = this.models.get(modelName);
            if (model === undefined) {
                console.log('model not found: ' + modelName)
                setTimeout(() => {
                    this.modelListener.emitStrategyEvent(params);
                }, STRATEGY_INTARVAL_MILLI_SEC);
                return;
            }

            const result = this.game.selectNextState(model.getChooseStrategy(reverseTemperature), params.turnPlayer);
            if (result.isErr()) return;
            this.game = result.value;

            this.emitEvents();
        });
    }

    private emitEvents() {
        for (let i = 0; i < 12; i++) {
            this.stateListener.emitSquareViewModel(i as SquareIndex, this.getSquareViewModel(i as SquareIndex));
        }

        for (let i = 0; i < 6; i++) {
            this.stateListener.emitCapturedViewModel(i as CapturedIndex, this.getCapturedViewModel(i as CapturedIndex));
        }

        this.stateListener.emitSystemViewModel(this.getSystemViewModel());
        
        const turnPlayer = this.game.getTurnPlayer();
        if (this.getPlayType(turnPlayer).getPlayStrategy() === 'STRATEGY' && !this.game.isFinished()) {
            setTimeout(() => {
                this.modelListener.emitStrategyEvent({
                    turnPlayer: this.game.getTurnPlayer(),
                });
            }, STRATEGY_INTARVAL_MILLI_SEC);
        }
    }

    private getSquareViewModel(squareIndex: SquareIndex): SquareViewModel {
        return this.game.getSquareViewModel(squareIndex);
    }

    private getCapturedViewModel(capturedIndex: CapturedIndex): CapturedViewModel {
        return this.game.getCapturedViewModel(capturedIndex);
    }

    private getSystemViewModel(): SystemViewModel {
        const viewModel = this.game.getSystemViewModel(this.notStarted);
        const thinking = this.getPlayType(this.game.getTurnPlayer()).getPlayStrategy() === 'STRATEGY';

        return {
            ...viewModel,
            thinking
        }
    }


    private getPlayType(turnPlayer: Player) {
        return turnPlayer === 'ME' ? this.playTypes.me : this.playTypes.opponent;
    }

    private loadModel(modelName: ModelName) {
        if (this.models.has(modelName)) return;
        Model.load(modelName).then((model) => {
            console.log('load model: ' + modelName)
            this.models.set(modelName, model);
        });
    }
}
