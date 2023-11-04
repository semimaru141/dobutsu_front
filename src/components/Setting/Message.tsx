import { Player } from "@/const";
import { useSystem } from "@/hooks/setting/useSystem";
import styled from "styled-components";

export const Message = () => {
    const {
        system,
    } = useSystem();

    const turnStr = turnStringParser(system.turnPlayer);

    if (system.notStarted) {
        return (
            <MessageDiv>
                「Start」を押してください
            </MessageDiv>
        );
    } else if (system.finishStatus.isFinished) {
        return (
            <MessageDiv>
                <PlayerSpan $player={system.finishStatus.winner}>
                    {turnStringParser(system.finishStatus.winner)}
                </PlayerSpan> の勝ちです
            </MessageDiv>
        );
    } else if (system.thinking) {
        return (
            <MessageDiv>
                <PlayerSpan $player={system.turnPlayer}>
                    {turnStr}
                </PlayerSpan>
                のAIが思考中です... 
            </MessageDiv>
        );
    } else {
        return (
            <MessageDiv>
                <PlayerSpan $player={system.turnPlayer}>
                    {turnStr}
                </PlayerSpan>
                のターンです
            </MessageDiv>
        );
    }
}

const MessageDiv = styled.div`
    margin: 10px;
    font-size: 24px;
`;

const PlayerSpan = styled.span<{ $player: Player }>`
    ${
        props => props.$player === 'ME' ? 'color: black' : 'color: red'
    };
    font-size: 36px;
    font-weight: bold;
`;

const turnStringParser = (turn: Player): string => {
    switch (turn) {
        case 'ME':
            return '先手';
        case 'OPPONENT':
            return '後手';
    }
}
