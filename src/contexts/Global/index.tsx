import { createContext, useReducer, useContext } from 'react';
import reducer, { iGlobalState, GlobalActions, defaultState } from './reducer';

const initialState = defaultState;

export interface AuthProviderValue {
  state: iGlobalState;
  dispatch(action: GlobalActions): void;
}

// Create an initial provider value.
const providerValue: AuthProviderValue = {
  state: initialState,
  dispatch: (action) => {}, // << This will be overwritten
};
// Create the store or 'context'.
const globalContext = createContext(providerValue);
globalContext.displayName = 'GlobalCtx';
const { Provider } = globalContext;

type Reducer<iGlobalState, GlobalActions> = (
  prevState: iGlobalState,
  action: GlobalActions
) => iGlobalState;

const GlobalContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<iGlobalState, any>>(
    reducer,
    initialState
  );
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

function useGlobal() {
  return useContext(globalContext);
}

export { useGlobal, GlobalContextProvider };
