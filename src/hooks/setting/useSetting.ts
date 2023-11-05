import { DEFAULT_REVERSE_TEMPERATURE, MAX_REVERSE_TEMPERATURE, MIN_REVERSE_TEMPERATURE, ReverseTemperature } from "@/const";
import { ModelName, MODEL_NAMES } from "@/const/model";
import { PlayType } from "@/domain/playType/playType";
import { useCallback, useState } from "react";
import { useGlobal } from "../systemProvider"

type OptionValue = 'click' | `strategy_${ModelName}`;
const options: ({
    name: string,
    value: OptionValue,
    modelName?: ModelName,
})[] = [
    {
        name: 'プレイヤー',
        value: 'click',
    },
    ...MODEL_NAMES.map(model => ({
        name: 'AI: ' + model,
        value: 'strategy_' + model as OptionValue,
        modelName: model,
    }))
];

const createPlayType = (modelName: ModelName | undefined, reverseTemperature: ReverseTemperature): PlayType => {
    if (modelName === undefined) return PlayType.createClick();
    const result = PlayType.create({
        playStrategy: 'STRATEGY',
        modelName,
        reverseTemperature,
    });
    if (result.isErr()) throw result.error;
    return result.value;
};

export const useSetting = () => {
    const {
        gameListener,
    } = useGlobal();

    const [meValue, setMeValue] = useState<OptionValue>('click');
    const [opValue, setOpValue] = useState<OptionValue>('click');

    const [meReverseTemperature, setMeReverseTemperature] = useState<ReverseTemperature>(DEFAULT_REVERSE_TEMPERATURE);
    const [opReverseTemperature, setOpReverseTemperature] = useState<ReverseTemperature>(DEFAULT_REVERSE_TEMPERATURE);

    const start = useCallback(() => {
        const meModelName = options.find(option => option.value === meValue)!.modelName;
        const opModelName = options.find(option => option.value === opValue)!.modelName;

        const mePlayType = createPlayType(meModelName, meReverseTemperature);
        const opPlayType = createPlayType(opModelName, opReverseTemperature);

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
        meReverseTemperature,
        opReverseTemperature,
    ]);

    const reset = useCallback(() => {
        gameListener.emitGameEvent({
            type: 'reset',
        });
    }, [
        gameListener,
    ]);

    const meReverseTemperatureMinusOne = useCallback(() => {
        if (MIN_REVERSE_TEMPERATURE < meReverseTemperature) {
            setMeReverseTemperature(meReverseTemperature - 1);
        }
    }, [
        meReverseTemperature,
    ]);

    const meReverseTemperaturePlusOne = useCallback(() => {
        if (meReverseTemperature < MAX_REVERSE_TEMPERATURE) {
            setMeReverseTemperature(meReverseTemperature + 1);
        }
    }, [
        meReverseTemperature,
    ]);

    const opReverseTemperatureMinusOne = useCallback(() => {
        if (MIN_REVERSE_TEMPERATURE < opReverseTemperature) {
            setOpReverseTemperature(opReverseTemperature - 1);
        }
    }, [
        opReverseTemperature,
    ]);

    const opReverseTemperaturePlusOne = useCallback(() => {
        if (opReverseTemperature < MAX_REVERSE_TEMPERATURE) {
            setOpReverseTemperature(opReverseTemperature + 1);
        }
    }, [
        opReverseTemperature,
    ]);

    return {
        start,
        reset,
        me: {
            playTypePullDown: {
                value: meValue,
                options,
                onChange: setMeValue,
            },
            reverseTemperature: {
                value: meReverseTemperature,
                onChange: setMeReverseTemperature,
                minusOne: meReverseTemperatureMinusOne,
                plusOne: meReverseTemperaturePlusOne,
            }
        },
        opponent: {
            playTypePullDown: {
                value: opValue,
                options,
                onChange: setOpValue,
            },
            reverseTemperature: {
                value: opReverseTemperature,
                onChange: setOpReverseTemperature,
                minusOne: opReverseTemperatureMinusOne,
                plusOne: opReverseTemperaturePlusOne,
            }
        }
    }
};
