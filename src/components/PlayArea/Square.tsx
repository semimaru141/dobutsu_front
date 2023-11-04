import { EMPTY, MY_CHICK_NUM, MY_ELE_NUM, MY_GIR_NUM, MY_HEN_NUM, MY_LION_NUM, OP_CHICK_NUM, OP_ELE_NUM, OP_GIR_NUM, OP_HEN_NUM, OP_LION_NUM, Piece, Player, SquareIndex } from "@/const";
import { useSquare } from "@/hooks/playArea/useSquare";
import { isMyPiece } from "@/util/pieceFunc";
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

    return (
        <SquareDiv
            $clickable={square.state}
            $player={isMyPiece(square.piece) ? 'ME' : 'OPPONENT'}
            onClick={clickBoard}
        >
            {pieceStringParser(square.piece)}
            {pieceDotChanger(square.piece).map((dot, index) => (
                <DotDiv
                    $x={dot[0]}
                    $y={dot[1]}
                    $player={isMyPiece(square.piece) ? 'ME' : 'OPPONENT'}
                    key={index + '_' + square.piece + '_dot_' + dot[0] + '_' + dot[1]}
                />
            ))}
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

const pieceDotChanger = (piece: Piece): [-1 | 0 | 1, -1 | 0 | 1][] => {
    switch (piece) {
        case EMPTY:
            return [];
        case MY_LION_NUM:
        case OP_LION_NUM:
            return [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        case MY_ELE_NUM:
        case OP_ELE_NUM:
            return [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        case MY_GIR_NUM:
        case OP_GIR_NUM:
            return [[0, -1], [-1, 0], [1, 0], [0, 1]];
        case MY_CHICK_NUM:
            return [[0, -1]];
        case OP_CHICK_NUM:
            return [[0, 1]];
        case MY_HEN_NUM:
            return [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]];
        case OP_HEN_NUM:
            return [[0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    }   
}

const SquareDiv = styled.div<{ $clickable: SquareState, $player: Player }>`
    width: 100px;
    height: 100px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    position: relative;
    cursor: pointer;
    ${
        props =>  props.$clickable === 'clickable' ? 'background-color: pink' : props.$clickable === 'selecting' ? 'background-color: palegreen' : ''
    };
    ${
        props => props.$player === 'ME' ? 'color: black' : 'color: red'
    };
`;

const DotDiv = styled.div<{ $x: -1 | 0 | 1, $y: -1 | 0 | 1, $player: Player }>`
    position: absolute;
    ${
        props => {
            switch (props.$y) {
                case -1:
                    return 'top: 5px';
                case 0:
                    return '';
                case 1:
                    return 'bottom: 5px';
            }
        }
    };
    ${
        props => {
            switch (props.$x) {
                case -1:
                    return 'left: 5px';
                case 0:
                    return '';
                case 1:
                    return 'right: 5px';
            }
        }
    };
    width: 10px;
    height: 10px;
    border-radius: 50%;
    ${
        props => props.$player === 'ME' ? 'background-color: black' : 'background-color: red'
    };
`;
