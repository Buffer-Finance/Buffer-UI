import { LONG_TIMEOUT } from "config";
import { CHAIN_CONFIGS } from "config";
import axiosInstance from "@Config/axios";
import { GlobalActions, iGlobalState } from "@Contexts/Global/reducer";
import { getApi } from "./api";

const contextInitializers = async (
  state: iGlobalState,
  dispatch: (props: GlobalActions) => void
) => {
  if (!state.settings.activeChain) return;
  const env =
    CHAIN_CONFIGS[import.meta.env.VITE_ENV][state.settings.activeChain.name].env;

  const [res, err] = await getApi(
    "/status/",
    {
      env: env,
    },
    { timeout: LONG_TIMEOUT }
  );
  if (err) {
    return;
  }
  const optionProviders = res && res.option_assets[env];
  dispatch({ type: "UPDATE_ASSETS", payload: optionProviders });
  dispatch({ type: "UPDATE_CATAGORIES", payload: res.categories });

  axiosInstance
    .get("/contracts/", {
      params: {
        environment: env,
      },
      timeout: LONG_TIMEOUT,
    })
    .then((res) =>
      dispatch({ type: "UPDATE_CONTRACTS", payload: res.data.data })
    );
};

export default contextInitializers;
