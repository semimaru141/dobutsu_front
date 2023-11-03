import { CapturedIndex, Player, PlayTypeStatus, SquareIndex } from "@/const";
import { isEmpty } from "@/util/pieceFunc";
import { CapturedState, CapturedViewModel } from "@/viewModel/capturedViewModel";
import { SquareState, SquareViewModel } from "@/viewModel/squareViewModel";
import { SystemViewModel } from "@/viewModel/systemViewModel";
import { err, ok, Result } from "neverthrow";
import { ShogiState } from "../shogi/shogiState";
import { GameState } from "./gameState";

export class Game {
    constructor(
        private shogiState: ShogiState,
        private gameState: GameState,
    ) {}

    public static createInitialState(playTypeStatus: PlayTypeStatus) {
        return new Game(
            ShogiState.createInitialState(),
            GameState.createInitialState(playTypeStatus),
        );
    }

    public getSquareViewModel(squareIndex: SquareIndex): SquareViewModel {
        const selectingAction = this.gameState.getSelectingAction();
        const piece = this.shogiState.getPiece(squareIndex);
        const squareState = ((): SquareState => {
            switch (selectingAction.type) {
                case 'NONE': {
                    return 'inclickable';
                } case 'BOARD': {
                    if (selectingAction.squareIndex === squareIndex) return 'selecting';
                    const selectingPiece = this.shogiState.getPiece(selectingAction.squareIndex);
                    const result = this.shogiState.canMovePiece(
                        selectingPiece,
                        selectingAction.squareIndex,
                        squareIndex
                    );
                    return result.isOk() ? 'clickable' : 'inclickable';
                } case 'CAPTURED': {
                    return isEmpty(piece) ? 'clickable' : 'inclickable';
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
        const selectingAction = this.gameState.getSelectingAction();
        const amount = this.shogiState.getAmount(capturedIndex);
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

    public getSystemViewModel(notStarted: boolean): SystemViewModel {
        if (notStarted) {
            return {
                turnPlayer: 'ME',
                finishStatus: {
                    isFinished: true,
                    winner: 'ME',
                },
                notStarted: true,
                thinking: false,
            };
        }
        const winnerResult = this.gameState.getWinner();
        const turnPlayer = this.gameState.getTurnPlayer();
        if(winnerResult.isErr()) {
            return {
                turnPlayer,
                finishStatus: {
                    isFinished: false,
                },
                notStarted: false,
                thinking: this.gameState.getPlayType() === 'STRATEGY',
            };
        } else {
            return {
                turnPlayer,
                finishStatus: {
                    isFinished: true,
                    winner: winnerResult.value,
                },
                notStarted: false,
                thinking: false,
            };
        }
    }

    public isTurnForStrategy(): boolean {
        return this.gameState.getPlayType() === 'STRATEGY';
    }

    public clickBoard(clickedSquareIndex: SquareIndex): Result<Game, Error> {
        // AIの手番の場合はクリックを無視する
        const playType = this.gameState.getPlayType();
        if (playType === 'STRATEGY') return err(new Error());

        const toPiece = this.shogiState.getPiece(clickedSquareIndex);
        const selectingAction = this.gameState.getSelectingAction();

        switch (selectingAction.type) {
            case 'NONE': {
                // 選択中のマスがない場合はクリックされたマスを選択中のマスにする
                const result = this.gameState.setSelectingAction({
                    type: 'BOARD',
                    squareIndex: clickedSquareIndex,
                    piece: toPiece,
                });
                if (result.isErr()) return err(result.error);
                return ok(new Game(this.shogiState, result.value));
            } case 'BOARD': {
                if(selectingAction.squareIndex === clickedSquareIndex) {
                    // 選択中のマスとクリックされたマスが同じ場合は選択中のマスを解除する
                    return ok(this.clearState());
                } else {
                    // 選択中のマスとクリックされたマスが異なる場合は移動する
                    const moveRsult = this.shogiState.movePiece(selectingAction.squareIndex, clickedSquareIndex);
                    if (moveRsult.isErr()) return err(moveRsult.error);

                    return ok(this.turnEnd(moveRsult.value));
                }
            } case 'CAPTURED': {
                // 選択中のマスが駒台の場合は、クリックされたマスに駒を置く
                const putResult = this.shogiState.putPiece(
                    selectingAction.capturedIndex,
                    clickedSquareIndex
                );
                if (putResult.isErr()) return err(putResult.error);
                
                return ok(this.turnEnd(putResult.value));
            }
        }
    }

    public clickCaptured(capturedIndex: CapturedIndex): Result<Game, Error> {
        // AIの手番の場合はクリックを無視する
        const playType = this.gameState.getPlayType();
        if (playType === 'STRATEGY') return err(new Error());

        const selectingAction = this.gameState.getSelectingAction();

        if (selectingAction.type === 'CAPTURED' && selectingAction.capturedIndex === capturedIndex) {
            // 選択中のマスとクリックされたマスが同じ場合は選択中のマスを解除する
            return ok(this.clearState());
        } else {
            // 選択中のマスとクリックされたマスが異なる場合は選択中のマスをクリックされたマスにする
            const result = this.gameState.setSelectingAction({
                type: 'CAPTURED',
                capturedIndex: capturedIndex,
            });
            if (result.isErr()) return err(result.error);
            return ok(new Game(this.shogiState, result.value));
        }
    }

    public selectNextState(
        chooseKeyStrategy: (keys: string[]) => Result<string, Error>,
        turnPlayer: Player
    ): Result<Game, Error> {
        // プレイヤーの手番の場合は要求を無視する
        const playType = this.gameState.getPlayType();
        if (playType === 'CLICK') return err(new Error());

        const keys = this.shogiState.getNextStates(this.gameState.getTurnPlayer())
            .map((state) => turnPlayer === 'OPPONENT' ? state : state.turnState())
            .map((state) => state.getKey());
        const keyResult = chooseKeyStrategy(keys);

        if (keyResult.isErr()) return err(keyResult.error);

        const stateResult = ShogiState.parseKey(keyResult.value);
        if (stateResult.isErr()) return err(stateResult.error);
        const newState = turnPlayer === 'OPPONENT' ? stateResult.value : stateResult.value.turnState();

        return ok(this.turnEnd(newState));
    }

    public isFinished(): boolean {
        return this.gameState.isFinished();
    }

    public getTurnPlayer(): Player {
        return this.gameState.getTurnPlayer();
    }

    public getPlayTypeStatus(): PlayTypeStatus {
        return this.gameState.getPlayTypeStatus();
    }

    // ========================================

    /**
     * ターンを終了する
     * 終了判定を行い、終了している場合はゲームを終了する
     */
    private turnEnd(newShogiState: ShogiState) {
        const nextGameState = this.gameState.toggleTurn();
        const finish = newShogiState.isFinished(nextGameState.getTurnPlayer());

        if (finish.isFinished) {
            return new Game(newShogiState, nextGameState.setFinishStatus(finish.winner));
        } else {
            // 選択中のマスを解除し、手番を変更する
            return new Game(newShogiState, nextGameState);
        }
    }

    private clearState() {
        // 選択中のマスを解除する
        return new Game(this.shogiState, this.gameState.clearSelectingAction());
    }
}
