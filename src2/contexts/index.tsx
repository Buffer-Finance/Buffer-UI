import { GlobalContextProvider } from "./Global";
import ToastProvider from "./Toast";
import { RefreshContextProvider } from "./Refresher";
const ContextProvider = ({ children }) => {
  return (
    <GlobalContextProvider>
      <ToastProvider>{children}</ToastProvider>
    </GlobalContextProvider>
  );
};

export default ContextProvider;
