import { CapturedIndex, SquareIndex } from "@/const";
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

    public static createInitialState() {
        return new Game(
            ShogiState.createInitialState(),
            GameState.createInitialState(),
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

    public getSystemViewModel(): SystemViewModel {
        return {
            turn: this.gameState.getTurn(),
        }
    }

    public clickBoard(clickedSquareIndex: SquareIndex): Result<Game, Error> {
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

    // ========================================

    private turnEnd(newShogiState: ShogiState) {
        // 選択中のマスを解除し、手番を変更する
        return new Game(newShogiState, this.gameState.toggleTurn());
    }

    private clearState() {
        // 選択中のマスを解除する
        return new Game(this.shogiState, this.gameState.clearSelectingAction());
    }
}
