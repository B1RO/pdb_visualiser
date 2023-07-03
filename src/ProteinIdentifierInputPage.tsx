import styled from "styled-components";
import {useState} from "react";

const RootDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 3rem;
`;

const StyledInput = styled.input`
  margin-top: 2rem;
  border: none;
  background-color: #F5F5F5;
  border-radius: 0.5rem;;
  font-size: 2rem;
  height: 4rem;
`;

const Button = styled.button`
  background-color: #212121;
  color: white;
  margin-top: 2rem;
`;

export function ProteinIdentifierInputPage(props: { onSelectProteinIdentifier: (identifier: string) => unknown }) {
    let [text, setText] = useState<string>("");
    return <RootDiv>
        Type in a protein identifier:
        <StyledInput onChange={e => {
            console.log(e.target.value);
            setText(e.target.value);
        }}/>
        <Button onClick={() => {
            props.onSelectProteinIdentifier(text)
        }}>Go</Button>
    </RootDiv>
}
