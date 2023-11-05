import { SystemViewModel } from "@/viewModel/systemViewModel";
import { useGlobal  } from "../systemProvider"
import { useEffect, useState } from "react";

export const useSystem = () => {
    const {
        game,
        stateListener,
    } = useGlobal();

    const [system, setSystem] = useState<SystemViewModel>(game.getSystemViewModel(true));

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

    return {
        system
    }
}
