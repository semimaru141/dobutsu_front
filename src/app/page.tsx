"use client"

import { Explain } from '@/components/Explain/Explain'
import { PlayArea } from '@/components/PlayArea/PlayArea'
import { Setting } from '@/components/Setting/Setting'
import styled from 'styled-components'

export default function Home() {
  return (
    <Main>
      <PlayArea></PlayArea>
      <Setting></Setting>
      <Explain></Explain>
    </Main>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 12px auto;
`;
