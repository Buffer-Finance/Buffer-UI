import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import reduxThunk from "redux-thunk";
import {
  axiosInstance as api,
  setAuthorizationToken,
} from "../../config/axios";
import reducers from "./rootReducer";

export default function cofigureStore(initialSavedState?) {
  let store;
  const composeEnhancers =
    (typeof window !== "undefined" &&
      (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose)) ||
    compose;
  const initialState =
    initialSavedState ||
    (typeof window !== "undefined" && window["window.__REDUX_STATE__"]) ||
    {};
  const isClient = typeof window !== "undefined";
  if (isClient) {
    const { persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;
    const persistConfig = {
      key: "persisted-data-v1",
      storage,
    };
    store = createStore(
      persistReducer(persistConfig, reducers),
      initialState,
      composeEnhancers(
        applyMiddleware(
          reduxThunk.withExtraArgument({
            api,
            setAuthorizationToken,
          })
        )
      )
    );
    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(
      reducers,
      initialState,
      composeEnhancers(
        applyMiddleware(
          reduxThunk.withExtraArgument({
            api,
            setAuthorizationToken,
          })
        )
      )
    );
  }

  return store;
}
