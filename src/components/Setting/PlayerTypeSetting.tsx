import styled from "styled-components";
import { PullDown } from "./PullDown";

type Props<T extends string> = {
    pullDown: {
        value: T;
        options: {
            value: string;
            name: string;
        }[];
        onChange: (props: T) => void;
    },
    label: string
}

export const PlayerTypeSetting = <T extends string,>({
    pullDown: {
        value,
        options,
        onChange
    },
    label
}: Props<T>) => {
    return (
        <PlayerTypeSettingDiv>
            <Label>{label}</Label>
            <PullDown
                value={value}
                options={options}
                onChange={onChange}
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