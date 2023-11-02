"use client";
import { SquareIndex } from "@/const";
import { SquareViewModel } from "@/viewModel/squareViewModel";
import { useCallback, useEffect, useState } from "react";
import { useGame } from "./gameProvider"

export const useSquare = ({
    squareIndex,
}: {
    squareIndex: SquareIndex
}) => {
    const {
        game,
        stateListener,
        gameListener
    } = useGame();

    const [square, setSquare] = useState<SquareViewModel>(game.getSquareViewModel(squareIndex));

    useEffect(() => {
        const listener = (squareViewModel: SquareViewModel) => {
            setSquare(squareViewModel);
        }

        stateListener.onSquareViewModel(squareIndex, listener);

        return () => {
            stateListener.removeSquareViewModelListener(squareIndex, listener);
        }
    }, []);

    const clickBoard = useCallback(() => {
        gameListener.emitClickEvent({
            type: 'BOARD',
            squareIndex: squareIndex,
        });
    }, []);

    return {
        clickBoard,
        square,
    }
}
