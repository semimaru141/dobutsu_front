import { PlayTypeStatus } from "@/const";
import { SystemViewModel } from "@/viewModel/systemViewModel";
import { useCallback, useEffect, useState } from "react";
import { useSystem } from "./systemProvider"

type PlayTypeStatusValue = 'CC' | 'CS' | 'SC' | 'SS';
const playTypeStatusList: {
    value: PlayTypeStatusValue
    name: string,
    status: PlayTypeStatus,
}[] = [
    {
        value: 'CC',
        name: '先手プレイヤー・後手プレイヤー',
        status: {
            me: 'CLICK',
            opponent: 'CLICK',
        }
    },
    {
        value: 'CS',
        name: '先手プレイヤー・後手AI',
        status: {
            me: 'CLICK',
            opponent: 'STRATEGY',
        }
    },
    {
        value: 'SC',
        name: '先手AI・後手プレイヤー',
        status: {
            me: 'STRATEGY',
            opponent: 'CLICK',
        }
    },
    {
        value: 'SS',
        name: '先手AI・後手AI',
        status: {
            me: 'STRATEGY',
            opponent: 'STRATEGY',
        }
    },
];

export const useSetting = () => {
    const {
        game,
        stateListener,
        gameListener,
        setModel
    } = useSystem();
    const [system, setSystem] = useState<SystemViewModel>(game.getSystemViewModel(true));
    const [playTypeIndex, setPlayTypeIndex] = useState<PlayTypeStatusValue>('CC');

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

    const start = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'start',
            playType: playTypeStatusList.find((playType) => playType.value === playTypeIndex)!.status,
        });
    }, [
        gameListener,
        playTypeIndex
    ]);

    const reset = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'reset',
        });
    }, [
        gameListener,
    ]);

    const playTypeOnChange = useCallback((event: React.ChangeEvent<{ value: PlayTypeStatusValue }>) => {
        setPlayTypeIndex(event.target.value as PlayTypeStatusValue);
    }, []);

    return {
        start,
        reset,
        system,
        playTypePullDown: {
            value: playTypeIndex,
            onChange: playTypeOnChange,
            options: playTypeStatusList
        }
    }
};
