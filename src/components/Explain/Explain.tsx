import styled from "styled-components";

export const Explain = () => {
    return (
        <ExplainDiv>
            <ExplainTitle>モデルの強さ</ExplainTitle>
            <ExplainText>
                multi2_12: 活性化関数をtanhとした最新モデル<br />
                multi1_12: 活性化関数をそのまま足し合わせたモデル<br />
                1hour4: 1時間の学習で作成したモデル<br />
                first2_l: 初期に作成したモデル<br />
                softmax1_29: softmax法の温度を低下させたテストモデル<br />
            </ExplainText>
            <ExplainTitle>逆温度</ExplainTitle>
            <ExplainText>
                AIが選択する手のランダム性を表す<br />
                大きいほどランダム性が低くなり、強い手を打つようになる<br />
                逆温度を最大にした際にはランダム性を完全に排除している<br />
            </ExplainText>
        </ExplainDiv>
    );
}

const ExplainDiv = styled.div`
    padding: 24px 36px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: calc(50% - 72px);
    border-radius: 12px;
    background-color: white;
`;

const ExplainTitle = styled.h3`
    padding: 0 12px;
    font-size: 24px;
    width: calc(100% - 24px);
    margin: 0;
`;

const ExplainText = styled.p`
    padding: 0 12px;
    font-size: 15px;
    width: calc(100% - 24px);
`;
