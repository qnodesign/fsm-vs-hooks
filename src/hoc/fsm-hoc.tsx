import * as React from 'react';
import 'regenerator-runtime/runtime';
import { State, EventObject, StateSchema, MachineConfig, StateValue, MachineOptions, DefaultContext, Machine } from 'xstate';
import { StateMachineInjectedProps, StateMachineHOCState, Subtract, StateMachineStateName } from './fsm-types';
import { interpret, Interpreter } from 'xstate/lib/interpreter';
import { Subject } from 'rxjs';

export const withStateMachine = <
  TOriginalProps,
  TStateSchema extends StateSchema,
  TContext = DefaultContext,
  TEvent extends EventObject = EventObject
>(
  WrappedComponent: React.FunctionComponent<TOriginalProps & StateMachineInjectedProps<TContext, TStateSchema, TEvent>>,
  config: MachineConfig<TContext, TStateSchema, TEvent>,
  initialContext: TContext,
  channel?: Subject<TEvent>
) => {

  type WrapperProps = Subtract<TOriginalProps, StateMachineInjectedProps<TContext, TStateSchema, TEvent>>;
  type WrappedProps = TOriginalProps & StateMachineInjectedProps<TContext, TStateSchema, TEvent>;

  return class StateMachineWrapper extends React.Component<WrapperProps, StateMachineHOCState<TContext, TStateSchema>>  {

    public stateMachine = Machine(config, {}, initialContext);
    public interpreter: Interpreter<TContext, TStateSchema, TEvent>;
    public currentName: StateValue;
    public currentContext: TContext | null = null;

    public readonly state: StateMachineHOCState<TContext, TStateSchema> = {
      current: this.stateMachine.initialState.value as StateMachineStateName<TStateSchema>,
      context: this.stateMachine.context as TContext
    }

    componentDidMount() {
      this.initInterpreter();
      if (channel) {
        channel.subscribe((action: TEvent) => {
          this.handleSend(action);
        })
      }
    }

    componentWillUnmount() {
      this.stopInterpreter();
      this.currentContext = null;
      if (channel) {
        channel.unsubscribe();
      }
    }

    render(): JSX.Element {
      const props = { ...this.props, ...this.state } as WrappedProps;
      return (
        <WrappedComponent {...props} send={this.handleSend} injectMachineOptions={this.setMachineOptions} />
      );
    }

    initInterpreter() {
      if (!this.interpreter) {
        this.interpreter = interpret(this.stateMachine);
        this.interpreter.start();
        this.interpreter.onTransition((current) => {
          this.handleTransition(current);
        });
        this.interpreter.onChange((context) => {
          this.handleContext(context);
        });
      }
  }

    stopInterpreter() {
      if (this.interpreter) {
          this.interpreter.stop();
      }
    }

    handleTransition(newState: State<TContext, EventObject>) {
      const { changed, value, context } = newState;

      if (changed && value !== this.currentName) {
        this.currentName = value;
        const newStateName = value as StateMachineStateName<TStateSchema>;
        this.setState({ current: newStateName, context });
      }
    }
    handleContext(context: TContext) {
      if (context !== this.currentContext) {
        this.setState({ context });
        this.currentContext = context;
      }
    }

    setMachineOptions = (configOptions: Partial<MachineOptions<TContext, TEvent>>) => {
      if (!this.interpreter) {
        this.stateMachine = this.stateMachine.withConfig(configOptions);
        this.initInterpreter();
      }
    }

    handleSend = (action: TEvent) => {
      if (this.interpreter) {
        this.interpreter.send(action);
      }
    }

  }
} 