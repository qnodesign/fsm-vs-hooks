import React from 'react';
import styled from 'styled-components';
import Input from '../input'
import Label from '../input-label'
import { Edit } from '../../materials/icons';
import { withStateMachine } from '../../hoc/fsm-hoc';
import { StateMachineInjectedProps } from '../../hoc/fsm-types';
import { InlineInputMachineContext, InlineInputMachineChart, InlineInputMachineInitialContext, InlineInputMachineEvents, InlineInputMachineStateSchema, InlineInputMachineAction, InlineInputMachineState, InlineInputMachineEventType, InlineInputMachineService } from './inline-input-fsm';
import { SaveDataServiceArg, SaveDataServiceReturn } from './inline-input-types';

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

interface InlineInputProps extends StateMachineInjectedProps<InlineInputMachineContext, InlineInputMachineStateSchema, InlineInputMachineEvents> {
  value?: string,
  saveDataService?(arg: SaveDataServiceArg): SaveDataServiceReturn
}

const InlineInputWMachine:React.FunctionComponent<InlineInputProps> = ({ value, saveDataService, send, injectMachineOptions, current, context }) => {    
  
  const setTempValue = (e: React.FormEvent<HTMLInputElement>) => {
    send({type: InlineInputMachineAction.SET_TEMP_VALUE, value: e.currentTarget.value});
  }

  injectMachineOptions({
    services: {
      [InlineInputMachineService.SAVE_DATA]: (ctx: InlineInputMachineContext, e: InlineInputMachineEventType) => saveDataService ? saveDataService(e) : localSaveDataService(e)
    }
  });

  const saveData = () => {
    send({type: InlineInputMachineAction.SAVE_DATA});
  }

  const localSaveDataService = (e: SaveDataServiceArg): SaveDataServiceReturn => {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }
  
  const toggleEditable = () => {
    if(current.match(InlineInputMachineState.LABEL)) {
      send({ type: InlineInputMachineAction.MAKE_EDITABLE });
    } else {
      send({ type: InlineInputMachineAction.MAKE_READONLY });
    }
  }

  const toggleDisable = () => {
    if(current.match(InlineInputMachineState.DISABLED)) {
      send({ type: InlineInputMachineAction.MAKE_READONLY });
    } else {
      send({ type: InlineInputMachineAction.DISABLE });
    }
  }

  const onBlur = () => saveData();

  const checkKeyPress = (e:KeyboardEvent) => {
    if(e.keyCode === 27) toggleEditable();
    else if(e.keyCode === 13) saveData();
  }

  React.useEffect(() => {
    if(current.match(InlineInputMachineState.DISABLED)) send({ type: InlineInputMachineAction.DISABLE });
  }, [current, send]);

  React.useEffect(() => {
    send({ type: InlineInputMachineAction.HYDRATE, value })
  }, [])
  
  return (
    <>
      {current.match(InlineInputMachineState.INPUT) && 
        <Input 
          disabled={current.match(InlineInputMachineState.DISABLED)} 
          focusOnShow 
          onBlur={onBlur} 
          onChange={setTempValue} 
          onKeyDown={checkKeyPress} 
          type="text" 
          value={context.tempValue} 
        />
      }
      {(current.match(InlineInputMachineState.LABEL)) && 
        <LabelWithIcon onClick={toggleEditable}>
          {context.value}
          <EditIcon />
        </LabelWithIcon>
      }
      <button onClick={toggleDisable}>
        {current.match(InlineInputMachineState.DISABLED) ? 'en' : 'dis'}able
      </button>
    </>
  );
}

export default withStateMachine(
  InlineInputWMachine,
  InlineInputMachineChart,
  InlineInputMachineInitialContext
);


