import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  display: block;
  outline: none;
  padding: 5px;
  font-size: 16px;
  color: #009;
  border: 1px solid #999;
  width: calc(100% - 12px);
`;

export default (props: any) => {

  const textInput = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    if(props.focusOnShow) {
      textInput.current!.focus();
    }
  }, [textInput, props.focusOnShow]);

  return <Input ref={textInput} {...props} />;
}