import { CapturedIndex } from "@/const";
import styled from "styled-components";
import { Captured } from "./Captured";

export const MyCaptured = () => {
    return (
        <CapturedRow>
            {
                [0, 1, 2].map((capturedIndex) =>
                    <Captured capturedIndex={capturedIndex as CapturedIndex} key={'captured_' + capturedIndex} />
                )
            }
        </CapturedRow>
    );
}

const CapturedRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 50px;
    width: 100%;
`;
