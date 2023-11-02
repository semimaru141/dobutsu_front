"use client";

import { System } from "@/domain/system/system";
import { createContext, useContext } from "react"

export const SystemContext = createContext<System | undefined>(undefined);

export const useSystem = () => {
    const system = useContext(SystemContext) as System;
    return {
        game: system.getGame(),
        gameListener: system.getGameListener(),
        stateListener: system.getStateListener(),
    }
}
