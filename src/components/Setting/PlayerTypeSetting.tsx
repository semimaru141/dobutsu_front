import styled from "styled-components";
import { PullDown } from "./PullDown";
import { Range } from "./Range";

type Props<T extends string> = {
    pullDown: {
        value: T;
        options: {
            value: string;
            name: string;
        }[];
        onChange: (props: T) => void;
    },
    range: {
        value: number;
        onChange: (props: number) => void;
        minusOne: () => void;
        plusOne: () => void;
    },
    label: string
}

export const PlayerTypeSetting = <T extends string,>({
    pullDown: {
        value: pdValue,
        options,
        onChange: pdOnChange
    },
    range: {
        value: rValue,
        onChange: rOnChange,
        minusOne,
        plusOne
    },
    label
}: Props<T>) => {
    return (
        <PlayerTypeSettingDiv>
            <Label>{label}</Label>
            <PullDown
                value={pdValue}
                options={options}
                onChange={pdOnChange}
            />
            <Range 
                value={rValue}
                onChange={rOnChange}
                minusOne={minusOne}
                plusOne={plusOne}
            />
        </PlayerTypeSettingDiv>
    );
}

const PlayerTypeSettingDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 18px 24px;
    background-color: white;
    border-radius: 12px;
    width: calc(100% - 48px);
    border: 1px solid #cccccc;
`;

const Label = styled.div`
    padding: 0 10px;
    font-size: 24px;
    width: calc(100% - 20px);
`;