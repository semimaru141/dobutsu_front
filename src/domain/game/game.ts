import { CapturedIndex, EMPTY, MyCapturedIndex, MyPiece, OP_LION_NUM, SquareIndex } from "@/const";
import { CapturedState, CapturedViewModel } from "@/viewModel/capturedViewModel";
import { SquareState, SquareViewModel } from "@/viewModel/squareViewModel";
import { SystemViewModel } from "@/viewModel/systemViewModel";
import { ShogiState } from "../shogi/shogiState";
import { GameListener } from "./gameListener";
import { GameState } from "./gameState";
import { StateListener } from "./stateListner";

export class Game {
    private states: {
        shogiState: ShogiState;
        gameState: GameState;
    }

    constructor(
        private readonly gameListner: GameListener,
        private readonly stateListener: StateListener,
        shogiState: ShogiState,
        gameState: GameState,
    ) {
        this.states = {
            shogiState: shogiState,
            gameState: gameState,
        };
        this.init();
    }

    private init() {
        // 初期設定、イベントリスナの登録など
        this.gameListner.onGameEvent((param) => {
            switch (param.type) {
                case 'reset':
                    this.states.shogiState = ShogiState.createInitialState();
                    this.states.gameState = GameState.createInitialState();
            }
            this.emitViewModel();
        });

        this.gameListner.onClickEvent((param) => {
            switch (param.type) {
                case 'BOARD': {
                    this.clickBoard(param.squareIndex);
                    break;
                } case 'CAPTURED': {
                    this.clickCaptured(param.capturedIndex);
                    break;
                }
            }
            this.emitViewModel();
        });
    }

    public getGameListener() {
        return this.gameListner;
    }
    
    public getStateListener() {
        return this.stateListener;
    }

    public getSquareViewModel(squareIndex: SquareIndex): SquareViewModel {
        const selectingAction = this.states.gameState.getSelectingAction();
        const piece = this.states.shogiState.getPiece(squareIndex);
        const squareState = ((): SquareState => {
            switch (selectingAction.type) {
                case 'NONE': {
                    return 'inclickable';
                } case 'BOARD': {
                    if (selectingAction.squareIndex === squareIndex) return 'selecting';
                    const selectingPiece = this.states.shogiState.getPiece(selectingAction.squareIndex);
                    const result = this.states.shogiState.canMovePiece(
                        selectingPiece as MyPiece,
                        selectingAction.squareIndex,
                        squareIndex
                    );
                    return result.isOk() ? 'clickable' : 'inclickable';
                } case 'CAPTURED': {
                    return piece === EMPTY ? 'clickable' : 'inclickable';
                }
            }
        })()

        return {
            piece: piece,
            squareIndex: squareIndex,
            state: squareState,
        }            
    }

    public getCapturedViewModel(capturedIndex: CapturedIndex): CapturedViewModel {
        const selectingAction = this.states.gameState.getSelectingAction();
        const amount = this.states.shogiState.getAmount(capturedIndex);
        const capturedState = ((): CapturedState => {
            switch (selectingAction.type) {
                case 'NONE': {
                    return 'notselecting';
                } case 'BOARD': {
                    return 'notselecting';
                } case 'CAPTURED': {
                    return capturedIndex === selectingAction.capturedIndex ? 'selecting' : 'notselecting';
                }
            }
        })()

        return {
            capturedIndex: capturedIndex,
            amount: amount,
            state: capturedState,
        }   
    }

    public getSystemViewModel(): SystemViewModel {
        return {
            turn: this.states.gameState.getTurn(),
        }
    }

    // ========================================

    private clickBoard(clickedSquareIndex: SquareIndex) {
        const toPiece = this.states.shogiState.getPiece(clickedSquareIndex);
        const selectingAction = this.states.gameState.getSelectingAction();

        switch (selectingAction.type) {
            case 'NONE': {
                // 選択中のマスがない場合はクリックされたマスを選択中のマスにする

                // クリックされたマスが空の場合は何もしない
                if (toPiece === EMPTY) return;
                // クリックされたマスの駒が自分の駒でない場合は何もしない
                // todo 一旦自分の番のみを対象に作成
                if (toPiece >= OP_LION_NUM) return;
                
                this.states.gameState = this.states.gameState.setSelectingAction({
                    type: 'BOARD',
                    squareIndex: clickedSquareIndex,
                });
                return;
            } case 'BOARD': {
                if(selectingAction.squareIndex === clickedSquareIndex) {
                    // 選択中のマスとクリックされたマスが同じ場合は選択中のマスを解除する
                    this.clearState();
                } else {
                    // 選択中のマスとクリックされたマスが異なる場合は移動する
                    const moveRsult = this.states.shogiState.movePiece(selectingAction.squareIndex, clickedSquareIndex);
                    if (moveRsult.isErr()) return;
                    this.states.shogiState = moveRsult.value;

                    this.turnEnd();
                }
                return;
            } case 'CAPTURED': {
                // 選択中のマスが駒台の場合は、クリックされたマスに駒を置く
                const putResult = this.states.shogiState.putPiece(selectingAction.capturedIndex as MyCapturedIndex, clickedSquareIndex);
                if (putResult.isErr()) return;
                this.states.shogiState = putResult.value;

                this.turnEnd();
            }
        }
    }

    private clickCaptured(capturedIndex: CapturedIndex) {
        // todo 一旦自分の番のみを対象に作成
        if (capturedIndex >= 3) return;

        const selectingAction = this.states.gameState.getSelectingAction();

        if (selectingAction.type === 'CAPTURED' && selectingAction.capturedIndex === capturedIndex) {
            // 選択中のマスとクリックされたマスが同じ場合は選択中のマスを解除する
            this.clearState();
        } else {
            // 選択中のマスとクリックされたマスが異なる場合は選択中のマスをクリックされたマスにする
            this.states.gameState = this.states.gameState.setSelectingAction({
                type: 'CAPTURED',
                capturedIndex: capturedIndex,
            });
        }
    }

    private turnEnd() {
        // 選択中のマスを解除し、手番を変更する
        this.states.gameState = this.states.gameState.setSelectingAction({
            type: 'NONE',
        }).toggleTurn();
    }

    private clearState() {
        // 選択中のマスを解除する
        this.states.gameState = this.states.gameState.setSelectingAction({
            type: 'NONE',
        });
    }

    private emitViewModel() {
        for (let i = 0; i < 12; i++) {
            this.stateListener.emitSquareViewModel(i as SquareIndex, this.getSquareViewModel(i as SquareIndex));
        }

        for (let i = 0; i < 6; i++) {
            this.stateListener.emitCapturedViewModel(i as CapturedIndex, this.getCapturedViewModel(i as CapturedIndex));
        }

        this.stateListener.emitSystemViewModel(this.getSystemViewModel());
    }
}
