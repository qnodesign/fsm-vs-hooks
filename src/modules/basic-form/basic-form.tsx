import React from 'react';
import InlineInput from '../../components/inline-input';
import InlineInputWMachine from '../../components/inline-input-w-machine';
import { SaveDataServiceArg, SaveDataServiceReturn } from '../../components/inline-input-w-machine/inline-input-types';

const BasicForm:React.FunctionComponent = () => {

  // e: type of action, here the backend call or whatever can be adjusted
  const saveData = (e: SaveDataServiceArg): SaveDataServiceReturn => {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  const saveDataHook = (stg: any) => {
    return new Promise((resolve, reject) => {
      return resolve(stg);
    });
  }

  return <>
    <h2>Controlled components</h2>
    <h3>with hook</h3>
    <InlineInput value="Hello world" saveDataService={saveDataHook} />
    <h3>with machine</h3>
    <InlineInputWMachine value="Hello world" saveDataService={saveData} />
    <InlineInputWMachine value="Hello world1" saveDataService={saveData} />
    <InlineInputWMachine value="Hello world2" saveDataService={saveData} />
    <InlineInputWMachine value="Hello world3" saveDataService={saveData} />
  </>
};

export default BasicForm;