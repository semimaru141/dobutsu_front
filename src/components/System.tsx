import { useSetting } from "@/hooks/useSetting";
import { Turn } from "@/viewModel/systemViewModel";
import styled from "styled-components";

export const System = () => {
    const { 
        system,
        reset
    } = useSetting();

    return (
        <SystemDiv>
            <TurnDiv>
                { turnStringParser(system.turn) }
            </TurnDiv>
            <ResetButton onClick={reset}>
                Reset
            </ResetButton>
        </SystemDiv>
    );
}

const SystemDiv = styled.div`
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ResetButton = styled.button`
    width: 100px;
    height: 50px;
    font-size: 20px;
`;

const TurnDiv = styled.div`
  font-size: 20px;
`;

const turnStringParser = (turn: Turn): string => {
    switch (turn) {
        case 'ME':
            return 'あなたの番です';
        case 'OPPONENT':
            return '相手の番です';
    }
}
