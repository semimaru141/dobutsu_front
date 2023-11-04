import { CapturedIndex } from "@/const";
import styled from "styled-components";
import { Captured } from "./Captured";

export const OpCaptured = () => {
    return (
        <CapturedRow>
            {
                [3, 4, 5].map((capturedIndex) =>
                    <Captured capturedIndex={capturedIndex as CapturedIndex} key={'captured_' + capturedIndex} />
                )
            }
        </CapturedRow>
    );
}

const CapturedRow = styled.div`
    margin: 24px 36px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 60px;
    width: calc(100% - 72px);
`;
