"use client";

import { GameContext } from '../hooks/gameProvider'
import { Game } from '../domain/game/Game'
import { GameListener } from '../domain/game/GameListener'
import { StateListener } from '@/domain/game/stateListner'
import { ShogiState } from '@/domain/shogi/shogiState'
import { GameState } from '@/domain/game/gameState'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GameContext.Provider value={
      new Game(
          new GameListener(),
          new StateListener(),
          ShogiState.createInitialState(),
          GameState.createInitialState()
      )
    }>
      <html lang="jp">
        <body>{children}</body>
      </html>
    </GameContext.Provider>
  );
}
