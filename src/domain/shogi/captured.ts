import { CapturedIndex } from "@/const";

export class Captured {
    constructor (
        private readonly capturedIndex: CapturedIndex,
        private readonly amount: number = 0,
    ) {}

    public getCapturedIndex() {
        return this.capturedIndex;
    }

    public getAmount() {
        return this.amount;
    }

    public setAmount(amount: number): Captured {
        return new Captured(this.capturedIndex, amount);
    }
}
