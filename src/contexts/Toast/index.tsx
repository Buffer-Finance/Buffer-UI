import Toasts from '@Views/Common/Toast';
import React, { useReducer, useContext } from 'react';
import reducer from './reducer';

export const NotificationContext: any = React.createContext({});

function ToastProvider(props: any) {
  const initialState: unknown = [];
  const [state, dispatch] = useReducer<any>(reducer, initialState);
  return (
    <NotificationContext.Provider value={dispatch}>
      <Toasts state={state} />
      {props.children}
    </NotificationContext.Provider>
  );
}
export const useToast: any = () => {
  return useContext(NotificationContext);
};

export default ToastProvider;
