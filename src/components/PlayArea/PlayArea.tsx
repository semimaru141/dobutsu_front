import { Player } from "@/const";
import { useSystem } from "@/hooks/setting/useSystem";
import styled from "styled-components";
import { Board } from "./Board"
import { MyCaptured } from "./MyCaptured"
import { OpCaptured } from "./OpCaptured"

export const PlayArea = () => {
    const {
        system
    }  = useSystem();

    return (
        <PlayAreaDiv $turn={system.turnPlayer} $isFinished={system.finishStatus.isFinished}>
            <OpCaptured></OpCaptured>
            <Board></Board>
            <MyCaptured></MyCaptured>
        </PlayAreaDiv>
    );
}

const PlayAreaDiv = styled.div<{ $turn: Player, $isFinished: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 450px;
    height: 630px;
    border: 1px solid #cccccc;
    border-radius: 12px;
    ${
        props => {
            if (props.$isFinished) {
                return ''
            } else {
                return 'background: linear-gradient(' +
                    (props.$turn === 'ME' ? 'to bottom' : 'to top') +
                ', white 90%, #D8FBD8 100%);'
            }
        }
    }
`;
