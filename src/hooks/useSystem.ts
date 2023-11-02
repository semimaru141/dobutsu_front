import { SystemViewModel } from "@/viewModel/systemViewModel";
import { useCallback, useEffect, useState } from "react";
import { useGame } from "./gameProvider"

export const useSystem = () => {
    const {
        game,
        stateListener,
        gameListener
    } = useGame();
    const [system, setSystem] = useState<SystemViewModel>(game.getSystemViewModel()); 

    useEffect(() => {
        const listener = (systemViewModel: SystemViewModel) => {
            setSystem(systemViewModel);
        }

        stateListener.onSystemViewModel(listener);

        return () => {
            stateListener.removeSystemViewModelListener(listener);
        }
    }, []);

    const reset = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'reset',
        });
    }, []);

    return {
        reset,
        system,
    }
};
