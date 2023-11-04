import { SquareIndex } from "@/const";
import styled from "styled-components";
import { Square } from "./Square"

export const Board = () => {
    return (
        <BoardDiv>
            {
                [0, 1, 2, 3].map((rowIndex) => 
                    <BoardRow key={'row_' + rowIndex}>
                        {
                            [0, 1, 2].map((columnIndex) => 
                                <Square squareIndex={(3 * rowIndex + columnIndex) as SquareIndex } key={'square_' + rowIndex + '_' + columnIndex} />
                            )
                        }
                    </BoardRow>
                )
            }
        </BoardDiv>
    );
}

const BoardDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BoardRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;
