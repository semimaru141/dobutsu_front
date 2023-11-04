import { PlayTypeStatus } from "@/const";
import { useCallback, useEffect, useState } from "react";
import { useGlobal } from "../systemProvider"

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
        gameListener,
        setModel
    } = useGlobal();
    const [playTypeIndex, setPlayTypeIndex] = useState<PlayTypeStatusValue>('CC');

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

    const playTypeOnChange = useCallback((value: PlayTypeStatusValue) => {
        setPlayTypeIndex(value);
    }, []);

    return {
        start,
        reset,
        playTypePullDown: {
            value: playTypeIndex,
            onChange: playTypeOnChange,
            options: playTypeStatusList
        }
    }
};
