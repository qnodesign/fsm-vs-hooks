import React from 'react';
import styled from 'styled-components';
import Input from '../input'
import Label from '../input-label'
import { Edit } from '../../materials/icons';

const LabelWithIcon = styled(Label)``;

const EditIcon = styled(Edit)`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  color: #009;
  display: none;
  ${LabelWithIcon}:hover & {
    display: block;
  }
`;

interface InlineInputProps {
  value?: string,
  saveDataService?(arg: string | {}): Promise<string | {}>
}

const InlineInput:React.FunctionComponent<InlineInputProps> = ({ value, saveDataService }) => {

  const [savedValue, setSavedValue] = React.useState(value || '');
  const [temporaryValue, setTemporaryValue] = React.useState(value || '');
  
  const [escPressed, setEscPressed] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  
  const toggleEditable = () => {
    if(saveDataService) {
      saveDataService(temporaryValue).then(setSavedValue)
    } else {
      setSavedValue(temporaryValue);
    }
    setEditable(!editable);
  }
  const toggleDisabled = () => setDisabled(!disabled);
  const setTempValue = (e: React.FormEvent<HTMLInputElement>) => setTemporaryValue(e.currentTarget.value);

  const checkKeyPress = (e:KeyboardEvent) => {
    if(e.keyCode === 27) {
      setEscPressed(true);
      setEditable(false);
    }
    if(e.keyCode === 13) {
      toggleEditable();
    }
  }

  React.useEffect(() => {
    if(escPressed && !editable) {
      setTemporaryValue(savedValue);
      setEscPressed(false);
    }
  }, [savedValue, escPressed, editable]);

  return (
    <>
    {!disabled && <>
      {editable ? 
        <Input type="text" focusOnShow value={temporaryValue} onChange={setTempValue} onKeyDown={checkKeyPress} onBlur={toggleEditable} />
        : 
        <LabelWithIcon onClick={toggleEditable}>{savedValue} <EditIcon /></LabelWithIcon>
      }
    </>}
    <button onClick={toggleDisabled}>{disabled ? 'en' : 'dis'}able</button>
    </>
  );
}

export default InlineInput;