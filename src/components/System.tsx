import { Player } from "@/const";
import { useSetting } from "@/hooks/useSetting";

import styled from "styled-components";

export const System = () => {
    const { 
        system,
        reset
    } = useSetting();

    const str = system.finishStatus.isFinished ? winnerStringParser(system.finishStatus.winner) : turnStringParser(system.turnPlayer);

    return (
        <SystemDiv>
            <TurnDiv>
                { str }
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

const winnerStringParser = (winner: Player): string => {
    switch (winner) {
        case 'ME':
            return '先手の勝ちです';
        case 'OPPONENT':
            return '後手の勝ちです';
    }
}

const turnStringParser = (turn: Player): string => {
    switch (turn) {
        case 'ME':
            return '先手の番です';
        case 'OPPONENT':
            return '後手の番です';
    }
}
