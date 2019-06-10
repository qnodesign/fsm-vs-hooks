
import React from 'react';
import BasicForm from './modules/basic-form';
import InlineInput from './components/inline-input';
import InlineInputWMachine from './components/inline-input-w-machine';
import styled from 'styled-components';

const AppContainer = styled.div`
  margin: 10px;
  padding: 20px;
`;

const Hr = styled.hr`
  border: none;
  height: 1px;
  background: #ccc;
`;

function App() {
  return (
    <AppContainer>
      <h2>Uncontrolled components</h2>
      <h3>with hook</h3>
      <InlineInput />
      <h3>with machine</h3>
      <InlineInputWMachine />
      <Hr />
      <BasicForm />
    </AppContainer>
  );
}

export default App;
