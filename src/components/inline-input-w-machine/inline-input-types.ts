import { StateMachineAction } from '../../hoc/fsm-types';
import { InlineInputMachineContext } from './inline-input-fsm';

export type SaveDataServiceArg = StateMachineAction<InlineInputMachineContext>
export type SaveDataServiceReturn = Promise<Partial<InlineInputMachineContext>>