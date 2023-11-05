import { CapturedIndex, SquareIndex } from "@/const";
import { PlayType } from "@/domain/playType/playType";

export const CLICK_EVENT = 'click';
export type ClickEventParams = {
    type: 'BOARD',
    squareIndex: SquareIndex
} | {
    type: 'CAPTURED',
    capturedIndex: CapturedIndex
}

export const GAME_EVENT = 'game';
export type GameEventParams = {
    type: 'reset'
} | {
    type: 'start',
    playType: {
        me: PlayType,
        opponent: PlayType
    }
}
