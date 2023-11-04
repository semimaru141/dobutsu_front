import styled from "styled-components";

type Props<T extends string> = {
    value: T;
    onChange: (props: T) => void;
    options: {
        value: string;
        name: string;
    }[];
}

export const PullDown = <T extends string,>({
    value,
    onChange,
    options
}: Props<T>) => {
    return (
        <PullDownHtml value={value} onChange={(e) => onChange(e.target.value as T)}>
            {
                options.map((option) => (
                    <option value={option.value} key={option.value}>
                        {option.name}
                    </option>
                ))
            }
        </PullDownHtml>
    );
}

const PullDownHtml = styled.select`
    margin: 10px;
    max-width: 400px;
    height: 30px;
    font-size: 20px;
`;
