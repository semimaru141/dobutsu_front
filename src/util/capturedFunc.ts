import { CapturedIndex, MyCapturedIndex, OpCapturedIndex, OP_ELE_INDEX } from "@/const";

export const isMyCaptured = (capturedIndex: CapturedIndex): capturedIndex is MyCapturedIndex => {
    return capturedIndex < OP_ELE_INDEX;
}

export const isOpCaptured = (capturedIndex: CapturedIndex): capturedIndex is OpCapturedIndex => {
    return capturedIndex >= OP_ELE_INDEX;
}
