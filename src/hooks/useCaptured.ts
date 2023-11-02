import { CapturedIndex } from "@/const";
import { CapturedViewModel } from "@/viewModel/capturedViewModel";
import { useCallback, useEffect, useState } from "react";
import { useSystem } from "./systemProvider";

export const useCaptured = ({
    capturedIndex
}: {
    capturedIndex: CapturedIndex;
}) => {
    const {
        game,
        stateListener,
        gameListener
    } = useSystem();

    const [captured, setCaptured] = useState<CapturedViewModel>(game.getCapturedViewModel(capturedIndex));

    useEffect(() => {
        const listener = (capturedViewModel: CapturedViewModel) => {
            setCaptured(capturedViewModel);
        }

        stateListener.onCapturedViewModel(capturedIndex, listener);

        return () => {
            stateListener.removeCapturedViewModelListener(capturedIndex, listener);
        }
    }, []);

    const clickCaptured = useCallback(() => {
        gameListener.emitClickEvent({
            type: 'CAPTURED',
            capturedIndex: capturedIndex,
        });
    }, []);

    return {
        captured,
        clickCaptured,
    };
}
