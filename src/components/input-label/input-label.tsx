import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  padding: 6px 5px;
  font-size: 16px;
  color: #009;
  border: 1px solid transparent;
  position: relative;
  height: 16px;
  background: #eee;
`;

export default ({children, ...rest}: any) => {
  const inputLabel = React.createRef<HTMLLabelElement>();
  return <Label ref={inputLabel} {...rest}>{children}</Label>;
}