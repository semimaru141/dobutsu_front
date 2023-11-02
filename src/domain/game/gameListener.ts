import EventEmitter from "events";
import { ClickEventParams, CLICK_EVENT, GameEventParams, GAME_EVENT } from "@/event/gameEvent";

export class GameListener extends EventEmitter {
    public emitGameEvent(param: GameEventParams) {
        this.emit(GAME_EVENT, param);
    }

    public onGameEvent(callback: (param: GameEventParams) => void) {
        this.on(GAME_EVENT, callback);
    }

    public emitClickEvent(param: ClickEventParams) {
        this.emit(CLICK_EVENT, param);
    }

    public onClickEvent(callback: (param: ClickEventParams) => void) {
        this.on(CLICK_EVENT, callback);
    }
}