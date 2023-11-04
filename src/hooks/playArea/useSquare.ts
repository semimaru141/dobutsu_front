"use client";
import { SquareIndex } from "@/const";
import { SquareViewModel } from "@/viewModel/squareViewModel";
import { useCallback, useEffect, useState } from "react";
import { useGlobal } from "../systemProvider"

export const useSquare = ({
    squareIndex,
}: {
    squareIndex: SquareIndex
}) => {
    const {
        game,
        stateListener,
        gameListener
    } = useGlobal();

    const [square, setSquare] = useState<SquareViewModel>(game.getSquareViewModel(squareIndex));

    useEffect(() => {
        const listener = (squareViewModel: SquareViewModel) => {
            setSquare(squareViewModel);
        }

        stateListener.onSquareViewModel(squareIndex, listener);

        return () => {
            stateListener.removeSquareViewModelListener(squareIndex, listener);
        }
    }, [
        squareIndex,
        stateListener
    ]);

    const clickBoard = useCallback(() => {
        gameListener.emitClickEvent({
            type: 'BOARD',
            squareIndex: squareIndex,
        });
    }, [
        squareIndex,
        gameListener,
    ]);

    return {
        clickBoard,
        square,
    }
}
