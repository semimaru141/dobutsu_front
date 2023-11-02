import { SystemViewModel } from "@/viewModel/systemViewModel";
import { useCallback, useEffect, useState } from "react";
import { useSystem } from "./systemProvider"

export const useSetting = () => {
    const {
        game,
        stateListener,
        gameListener
    } = useSystem();
    const [system, setSystem] = useState<SystemViewModel>(game.getSystemViewModel()); 

    useEffect(() => {
        const listener = (systemViewModel: SystemViewModel) => {
            setSystem(systemViewModel);
        }

        stateListener.onSystemViewModel(listener);

        return () => {
            stateListener.removeSystemViewModelListener(listener);
        }
    }, [
        stateListener,
    ]);

    const reset = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'reset',
        });
    }, [
        gameListener,
    ]);

    return {
        reset,
        system,
    }
};
