import { CapturedIndex } from "@/const";

export const capturedStates = ['selecting', 'notselecting'] as const;
export type CapturedState = typeof capturedStates[number];

export type CapturedViewModel = {
    capturedIndex: CapturedIndex;
    amount: number;
    state: CapturedState;
}
