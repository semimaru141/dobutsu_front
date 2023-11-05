import { MAX_REVERSE_TEMPERATURE, MIN_REVERSE_TEMPERATURE } from "@/const";
import styled from "styled-components";

type Props = {
    value: number;
    onChange: (props: number) => void;
    minusOne: () => void;
    plusOne: () => void;
}

export const Range = ({
    value,
    onChange,
    minusOne,
    plusOne
}: Props) => {
    const str = value === MAX_REVERSE_TEMPERATURE ? '最善手のみ' : value.toString();
    return (
        <RangeDiv>
            <RangeLabel>逆温度</RangeLabel>
            <RangeButton onClick={minusOne} >{'<'}</RangeButton>
            <RangeInput
                value={value}
                onChange={(e) => onChange(e.target.valueAsNumber)}
                type="range"
                min={MIN_REVERSE_TEMPERATURE}
                max={MAX_REVERSE_TEMPERATURE}
                step="1"
            />
            <RangeButton onClick={plusOne}>{'>'}</RangeButton>
            <RangeValue> { str } </RangeValue>
        </RangeDiv>
    );
}

const RangeDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 18px;
    padding: 0 12px;
`;

const RangeInput = styled.input`
    max-width: 400px;
    height: 36px;
`;

const RangeLabel = styled.label`
    font-size: 18px;
`;

const RangeButton = styled.div`
    font-size: 20px;
    cursor: pointer;
`;

const RangeValue = styled.div`
    font-size: 18px;
`;
