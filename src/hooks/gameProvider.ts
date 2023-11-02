"use client";
import { Game } from "@/domain/game/game";
import { createContext, useContext } from "react"

export const GameContext = createContext<Game | undefined>(undefined);

export const useGame = () => {
    const game = useContext(GameContext) as Game;
    return {
        game,
        gameListener: game.getGameListener(),
        stateListener: game.getStateListener(),
    }
}
