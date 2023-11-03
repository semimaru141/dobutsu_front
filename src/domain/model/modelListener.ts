import { StrategyEventParams, STRATEGY_EVENT } from "@/event/modelEvent";
import EventEmitter from "events";

export class ModelListener extends EventEmitter {
    public emitStrategyEvent(strategyEventParams: StrategyEventParams) {
        this.emit(this.makeStrategyEventName(), strategyEventParams);
    }

    public onStrategyEvent(callback: (strategyEventParams: StrategyEventParams) => void) {
        this.on(this.makeStrategyEventName(), callback);
    }

    public removeStrategyEventListener(listener: (strategyEventParams: StrategyEventParams) => void) {
        this.removeListener(this.makeStrategyEventName(), listener);
    }

    // ====================

    private makeStrategyEventName() {
        return STRATEGY_EVENT;
    }
}
