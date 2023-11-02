import { EMPTY, MY_CHICK_NUM, MY_ELE_NUM, MY_GIR_NUM, MY_HEN_NUM, MY_LION_NUM, OP_CHICK_NUM, OP_ELE_NUM, OP_GIR_NUM, OP_HEN_NUM, OP_LION_NUM, Piece, SquareIndex } from "@/const";
import { useSquare } from "@/hooks/useSquare";
import { SquareState } from "@/viewModel/squareViewModel";
import styled from "styled-components";

type Props = {
    squareIndex: SquareIndex;
}
export const Square: React.FC<Props> = ({ squareIndex }) => {
    const {
        square,
        clickBoard
    } = useSquare({ squareIndex });

    const str = pieceStringParser(square.piece);

    return (
        <SquareDiv
            $clickable={square.state}
            onClick={clickBoard}
        >
            {str}
        </SquareDiv>
    );
};

const pieceStringParser = (piece: Piece): string => {
    switch (piece) {
        case EMPTY:
            return '';
        case MY_LION_NUM:
            return 'L';
        case MY_ELE_NUM:
            return 'E';
        case MY_GIR_NUM:
            return 'G';
        case MY_CHICK_NUM:
            return 'C';
        case MY_HEN_NUM:
            return 'H';
        case OP_LION_NUM:
            return 'l';
        case OP_ELE_NUM:
            return 'e';
        case OP_GIR_NUM:
            return 'g';
        case OP_CHICK_NUM:
            return 'c';
        case OP_HEN_NUM:
            return 'h';
    }   
}

const SquareDiv = styled.div<{ $clickable: SquareState }>`
    width: 100px;
    height: 100px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    ${
        props => props.$clickable === 'clickable' ? 'background-color: pink' : props.$clickable === 'selecting' ? 'background-color: palegreen' : ''
    }
`;
