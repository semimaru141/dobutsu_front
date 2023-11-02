"use client";

import { SystemContext } from '../hooks/systemProvider'
import { Game } from '../domain/game/game'
import { GameListener } from '../domain/game/GameListener'
import { StateListener } from '@/domain/game/stateListner'
import { System } from '@/domain/system/system';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SystemContext.Provider value={
      new System(
        new GameListener(),
        new StateListener(),
        Game.createInitialState()
      )
    }>
      <html lang="jp">
        <body>{children}</body>
      </html>
    </SystemContext.Provider>
  );
}
