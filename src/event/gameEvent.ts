import { CapturedIndex, PlayType, PlayTypeStatus, SquareIndex } from "@/const";

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
    type: 'start'
    playType: PlayTypeStatus
}
