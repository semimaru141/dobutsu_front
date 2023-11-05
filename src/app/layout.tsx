"use client";

import { SystemContext } from '../hooks/systemProvider'
import { Game } from '../domain/game/game'
import { GameListener } from '../domain/game/gameListener'
import { StateListener } from '@/domain/game/stateListner'
import { System } from '@/domain/system/system';
import { ModelListener } from '@/domain/model/modelListener';
import { PlayType } from '@/domain/playType/playType';

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
        new ModelListener(),
        Game.createInitialState(),
        new PlayType('CLICK'),
        new PlayType('CLICK'),
      )
    }>
      <html lang="jp">
        <body>{children}</body>
      </html>
    </SystemContext.Provider>
  );
}
