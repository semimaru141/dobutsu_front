import { ModelName, MODEL_NAMES } from "@/const/model";
import { PlayType } from "@/domain/playType/playType";
import { useCallback, useState } from "react";
import { useGlobal } from "../systemProvider"

type OptionValue = 'click' | `strategy_${ModelName}`;
const options: ({
    name: string,
    value: OptionValue,
    playType: PlayType,
})[] = [
    {
        name: 'プレイヤー',
        value: 'click',
        playType: new PlayType('CLICK'),
    },
    ...MODEL_NAMES.map(model => ({
        name: 'AI: ' + model,
        value: 'strategy_' + model as OptionValue,
        playType: new PlayType('STRATEGY', model),
    }))
];

export const useSetting = () => {
    const {
        gameListener,
    } = useGlobal();

    const [meValue, setMeValue] = useState<OptionValue>('click');
    const [opValue, setOpValue] = useState<OptionValue>('click');

    const start = useCallback(() => {
        const mePlayType = options.find(option => option.value === meValue)!.playType;
        const opPlayType = options.find(option => option.value === opValue)!.playType;

        gameListener.emitGameEvent({
            type: 'start',
            playType: {
                me: mePlayType,
                opponent: opPlayType,
            }
        });
    }, [
        gameListener,
        meValue,
        opValue,
    ]);

    const reset = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'reset',
        });
    }, [
        gameListener,
    ]);

    return {
        start,
        reset,
        playTypePullDown: {
            me: {
                value: meValue,
                options,
                onChange: setMeValue,
            },
            opponent: {
                value: opValue,
                options,
                onChange: setOpValue,
            },
        }
    }
};
