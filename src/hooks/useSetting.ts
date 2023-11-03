import { SystemViewModel } from "@/viewModel/systemViewModel";
import { useCallback, useEffect, useState } from "react";
import { useSystem } from "./systemProvider"

export const useSetting = () => {
    const {
        game,
        stateListener,
        gameListener,
        setModel
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

    useEffect(() => {
        setModel('multi2_12');
    }, [
        setModel,
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
