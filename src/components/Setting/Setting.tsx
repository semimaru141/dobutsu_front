import { useSetting } from "@/hooks/setting/useSetting";

import styled from "styled-components";
import { Button } from "./Button";
import { Message } from "./Message";
import { PlayerTypeSetting } from "./PlayerTypeSetting";

export const Setting = () => {
    const { 
        start,
        playTypePullDown: {
            me,
            opponent,
        }
    } = useSetting();

    return (
        <SettingDiv>
            <SettingDivLeft>
                <Message />
            </SettingDivLeft>
            <SettingDivRight>
                <PlayerTypeSetting
                    label="先手"
                    pullDown={me}
                />
                <PlayerTypeSetting
                    label="後手"
                    pullDown={opponent}
                />
                <Button onClick={start}>Start</Button>
            </SettingDivRight>      
        </SettingDiv>
    );
}

const SettingDiv = styled.div`
    margin: 10px;
    width: 70%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 10px;
    border: 1px solid #cccccc;

    @media (max-width: 768px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const SettingDivLeft = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    border-right: 1px solid #cccccc;
`;

const SettingDivRight = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    gap: 12px;
`;
