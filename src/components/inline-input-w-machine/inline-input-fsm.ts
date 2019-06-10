import { MachineConfig } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { StateMachineAction } from '../../hoc/fsm-types';

export interface InlineInputMachineContext { 
  enabled: boolean,
  value: string,
  tempValue: string,
};

export enum InlineInputMachineState {
  DISABLED = 'DISABLED',
  INPUT = 'INPUT',
  INPUT_ERROR = 'INPUT_ERROR',
  LABEL = 'LABEL',
  PROCESSING = 'PROCESSING',
}

export enum InlineInputMachineAction {
  DISABLE = 'DISABLE',
  HYDRATE = 'HYDRATE',
  MAKE_EDITABLE = 'MAKE_EDITABLE',
  MAKE_READONLY = 'MAKE_READONLY',
  SAVE_DATA = 'SAVE_DATA',
  SET_TEMP_VALUE = 'SET_TEMP_VALUE',
}

export interface InlineInputMachineStateSchema {
  states: {
    [InlineInputMachineState.DISABLED]: {};
    [InlineInputMachineState.INPUT]: {};
    [InlineInputMachineState.INPUT_ERROR]: {};
    [InlineInputMachineState.LABEL]: {};
    [InlineInputMachineState.PROCESSING]: {};
  }
}

export type InlineInputMachineEvents = 
  | { type: InlineInputMachineAction.DISABLE }
  | { type: InlineInputMachineAction.HYDRATE, value: string }
  | { type: InlineInputMachineAction.MAKE_EDITABLE }
  | { type: InlineInputMachineAction.MAKE_READONLY }
  | { type: InlineInputMachineAction.SAVE_DATA }
  | { type: InlineInputMachineAction.SET_TEMP_VALUE, value: string }

export type InlineInputMachineEventType = StateMachineAction<InlineInputMachineContext>;

export enum InlineInputMachineService {
  SAVE_DATA = 'SAVE_DATA'
}

const onState = {
  [InlineInputMachineAction.SAVE_DATA]: {
    target: InlineInputMachineState.PROCESSING
  },
  [InlineInputMachineAction.SET_TEMP_VALUE]: {
    actions: assign((ctx, { value }) => ({
      tempValue: value
    }))
  },
  [InlineInputMachineAction.MAKE_READONLY]: {
    target: InlineInputMachineState.LABEL
  },
  [InlineInputMachineAction.DISABLE]: {
    target: InlineInputMachineState.DISABLED
  },
}

export const InlineInputMachineChart: MachineConfig<InlineInputMachineContext, InlineInputMachineStateSchema, InlineInputMachineEvents> = {
  key: 'inline-input',
  initial: InlineInputMachineState.LABEL,
  states: {
    [InlineInputMachineState.LABEL]: {
      on: {
        [InlineInputMachineAction.DISABLE]: {
          target: InlineInputMachineState.DISABLED
        },
        [InlineInputMachineAction.HYDRATE]: {
          actions: assign((ctx, { value }) => ({
            value
          }))
        },
        [InlineInputMachineAction.MAKE_EDITABLE]: {
          target: InlineInputMachineState.INPUT,
          actions: assign(({ value }) => ({
            tempValue: value
          }))
        }
      }
    },
    [InlineInputMachineState.INPUT]: {
      on: {
        ...onState
      }
    },
    [InlineInputMachineState.INPUT_ERROR]: {
      on: {
        ...onState
      }
    },
    [InlineInputMachineState.PROCESSING]: {
      invoke: {
        id: InlineInputMachineAction.SAVE_DATA,
        src: InlineInputMachineService.SAVE_DATA,
        onDone: {
          actions: assign(({ tempValue }) => ({
            value: tempValue
          })),
          target: InlineInputMachineState.LABEL,
        },
        onError: {
          target: InlineInputMachineState.INPUT_ERROR
        }
      }
    },
    [InlineInputMachineState.DISABLED]: {
      on: {
        [InlineInputMachineAction.MAKE_READONLY]: {
          target: InlineInputMachineState.LABEL
        }
      }
    }
  }
};

export const InlineInputMachineInitialContext: InlineInputMachineContext = {
  enabled: true,
  value: '',
  tempValue: '',
};

/*

for state chart demo

const saveData = inp => {
  context.value = inp;
  return new Promise((resolve, reject) =>{
    const success = Math.random(0,1) > 0.5;
    console.log('processing');
    return setTimeout(() => {
      console.log(success ? 'success' : 'error');
      success ? resolve() : reject();
    },1000);
  });
}
const context = { 
  enabled: true,
  value: '',
  tempValue: '',
}
const InlineInputMachineState = {
  DISABLED: 'DISABLED',
  INPUT: 'INPUT',
  INPUT_ERROR: 'INPUT_ERROR',
  LABEL: 'LABEL',
  PROCESSING: 'PROCESSING'
};

const InlineInputMachineService = {
  SAVE_DATA: (context, event) => saveData(context.tempValue),
};

const InlineInputMachineStateSchema = {
  states: {
    [InlineInputMachineState.DISABLED]: {},
    [InlineInputMachineState.INPUT]: {},
    [InlineInputMachineState.INPUT_ERROR]: {},
    [InlineInputMachineState.LABEL]: {},
    [InlineInputMachineState.PROCESSING]: {}
  }
}

const InlineInputMachineAction = {
  DISABLE: 'DISABLE',
  HYDRATE: 'HYDRATE',
  MAKE_EDITABLE: 'MAKE_EDITABLE',
  MAKE_READONLY: 'MAKE_READONLY',
  SAVE_DATA: 'SAVE_DATA',
  SET_TEMP_VALUE: 'SET_TEMP_VALUE',
} 

const onState = {
  [InlineInputMachineAction.SAVE_DATA]: {
    target: InlineInputMachineState.PROCESSING
  },
  [InlineInputMachineAction.SET_TEMP_VALUE]: {
    actions: assign((ctx, { value }) => ({
      tempValue: value
    }))
  },
  [InlineInputMachineAction.MAKE_READONLY]: {
    target: InlineInputMachineState.LABEL
  },
  [InlineInputMachineAction.DISABLE]: {
    target: InlineInputMachineState.DISABLED
  },
}

const fsm = Machine({
  key: 'inline-input',
  initial: InlineInputMachineState.LABEL,
  context: {
    enabled: true,
    value: '',
    tempValue: '',
  },
  states: {
    [InlineInputMachineState.LABEL]: {
      on: {
        [InlineInputMachineAction.DISABLE]: {
          target: InlineInputMachineState.DISABLED
        },
        [InlineInputMachineAction.HYDRATE]: {
          actions: assign((ctx, { value }) => ({
            value
          }))
        },
        [InlineInputMachineAction.MAKE_EDITABLE]: {
          target: InlineInputMachineState.INPUT,
          actions: assign(({ value }) => ({
            tempValue: value
          }))
        }
      }
    },
    [InlineInputMachineState.INPUT]: {
      on: {
        ...onState
      }
    },
    [InlineInputMachineState.INPUT_ERROR]: {
      on: {
        ...onState
      }
    },
    [InlineInputMachineState.PROCESSING]: {
      invoke: {
        id: InlineInputMachineAction.SAVE_DATA,
        src: InlineInputMachineService.SAVE_DATA,
        onDone: {
          actions: assign(({ tempValue }) => ({
            value: tempValue
          })),
          target: InlineInputMachineState.LABEL,
        },
        onError: {
          target: InlineInputMachineState.INPUT_ERROR
        }
      }
    },
    [InlineInputMachineState.DISABLED]: {
      on: {
        [InlineInputMachineAction.MAKE_READONLY]: {
          target: InlineInputMachineState.LABEL
        }
      }
    }
  }
});
*/