import { CapturedIndex, SquareIndex } from "@/const";

export const CLICK_EVENT = 'click';
export type ClickEventParams = {
    type: 'BOARD',
    squareIndex: SquareIndex
} | {
    type: 'CAPTURED',
    capturedIndex: CapturedIndex
}

export const GAME_EVENT = 'game';
const gameEvents = ["reset"] as const;
export type GameEventParams = {
    type: typeof gameEvents[number];
}
