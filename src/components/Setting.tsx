import { Player } from "@/const";
import { useSetting } from "@/hooks/useSetting";

import styled from "styled-components";

export const Setting = () => {
    const { 
        system,
        start,
        reset,
        playTypePullDown
    } = useSetting();

    const turnStr = turnStringParser(system.turnPlayer);

    const message = 
        system.notStarted ?
        (<MessageDiv>ゲーム開始ボタンを押してください</MessageDiv>) :
        system.finishStatus.isFinished ? 
        (<MessageDiv>
            <PlayerSpan $player={system.finishStatus.winner}>
                {turnStringParser(system.finishStatus.winner)}
            </PlayerSpan> の勝ちです
        </MessageDiv>) :
        system.thinking ?
        (<MessageDiv>
            <PlayerSpan $player={system.turnPlayer}>
                {turnStr}
            </PlayerSpan>
            のAIが思考中です... 
        </MessageDiv>):
        (<MessageDiv>
            <PlayerSpan $player={system.turnPlayer}>
                {turnStr}
            </PlayerSpan>
            のターンです
        </MessageDiv>);

    return (
        <SystemDiv>
            { message }
            {
                !system.notStarted && <Button onClick={reset}>
                    Reset
                </Button>
            }
            <PullDown value={playTypePullDown.value} onChange={playTypePullDown.onChange as any}>
                {
                    playTypePullDown.options.map((option) => (
                        <option value={option.value} key={option.value}>
                            {option.name}
                        </option>
                    ))
                }
            </PullDown>
            {
                <Button onClick={start}>
                    Start
                </Button>
            }
        </SystemDiv>
    );
}

const SystemDiv = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button`
    margin: 10px;
    width: 100px;
    height: 50px;
    font-size: 20px;
`;

const MessageDiv = styled.div`
    margin: 10px;
    font-size: 20px;
`;

const PlayerSpan = styled.span<{ $player: Player }>`
    ${
        props => props.$player === 'ME' ? 'color: black' : 'color: red'
    };
    font-size: 30px
`;

const PullDown = styled.select`
    margin: 10px;
    width: 400px;
    height: 30px;
    font-size: 20px;
`;

const turnStringParser = (turn: Player): string => {
    switch (turn) {
        case 'ME':
            return '先手';
        case 'OPPONENT':
            return '後手';
    }
}
