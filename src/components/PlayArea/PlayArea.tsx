import styled from "styled-components";
import { Board } from "./Board"
import { MyCaptured } from "./MyCaptured"
import { OpCaptured } from "./OpCaptured"

export const PlayArea = () => {
    return (
        <PlayAreaDiv>
            <OpCaptured></OpCaptured>
            <Board></Board>
            <MyCaptured></MyCaptured>
        </PlayAreaDiv>
    );
}

const PlayAreaDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 450px;
    height: 630px;
    border: 1px solid #cccccc;
    border-radius: 12px;
`;
