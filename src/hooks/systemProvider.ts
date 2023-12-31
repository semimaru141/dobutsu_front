"use client";

import { ModelName } from "@/const/model";
import { Model } from "@/domain/model/model";
import { System } from "@/domain/system/system";
import { createContext, useCallback, useContext } from "react"

export const SystemContext = createContext<System | undefined>(undefined);

export const useGlobal = () => {
    const system = useContext(SystemContext) as System;

    return {
        game: system.getGame(),
        gameListener: system.getGameListener(),
        stateListener: system.getStateListener(),
    }
}
