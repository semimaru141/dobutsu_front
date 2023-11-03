"use client"

import { Board } from '@/components/Board'
import { MyCaptured } from '@/components/MyCaptured'
import { OpCaptured } from '@/components/OpCaptured'
import { Setting } from '@/components/Setting'
import styled from 'styled-components'

export default function Home() {
  return (
    <Main>
      <OpCaptured></OpCaptured>
      <Board></Board>
      <MyCaptured></MyCaptured>
      <Setting></Setting>
    </Main>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
  margin: 0 auto;
`;
