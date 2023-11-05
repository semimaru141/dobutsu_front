import { CapturedIndex, MY_CHICK_INDEX, MY_ELE_INDEX, MY_GIR_INDEX, OP_CHICK_INDEX, OP_ELE_INDEX, OP_GIR_INDEX } from "@/const";
import { useCaptured } from "@/hooks/playArea/useCaptured";
import styled from "styled-components";

type Props = {
    capturedIndex: CapturedIndex;
}

export const Captured: React.FC<Props> = ({ capturedIndex }) => {
    const {
        captured,
        clickCaptured
    } = useCaptured({
        capturedIndex
    });

    if (captured.amount === 0) {
        return (
            <CapturedDivNone></CapturedDivNone>
        );
    } else {
        return (
            <CapturedContainer onClick={clickCaptured}>
                <CapturedDiv $selecting={captured.state === 'selecting'}>
                    {capturedStringParse(capturedIndex)}
                </CapturedDiv>
                <CapturedAmount>{captured.amount}</CapturedAmount>
            </CapturedContainer>
        );
    }
}

const capturedStringParse = (capturedIndex: CapturedIndex): string => {
    switch (capturedIndex) {
        case MY_ELE_INDEX:
            return 'E';
        case MY_GIR_INDEX:
            return 'G';
        case MY_CHICK_INDEX:
            return 'C';
        case OP_ELE_INDEX:
            return 'e';
        case OP_GIR_INDEX:
            return 'g';
        case OP_CHICK_INDEX:
            return 'c';
    }
}

const CapturedContainer = styled.div`
    position: relative;
`;
const CapturedDiv = styled.div<{ $selecting: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48px;
    width: 60px;
    height: 60px;
    cursor: pointer;
    ${
        props => props.$selecting ? 'background-color: palegreen' : ''
    }
`;
const CapturedDivNone = styled.div``;
const CapturedAmount = styled.div`
    position: absolute;
    top: 2px;
    right: 2px;
`;
