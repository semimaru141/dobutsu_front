import styled from "styled-components";

type Props = {
    onClick: () => void;
    children: React.ReactNode;
}

export const Button = ({
    onClick,
    children
}: Props) => {
    return (
        <ButtonHtml onClick={onClick}>
            {
                children
            }
        </ButtonHtml>
    );
}

const ButtonHtml = styled.button`
    margin: 10px;
    width: 100px;
    height: 50px;
    font-size: 20px;
    background-color: #fff;
`;
