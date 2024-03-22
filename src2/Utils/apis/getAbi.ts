import { IChain } from "@Contexts/Global/interfaces";
import { getApi } from "./api";

export const getAbi = async (contract_address: string, chain: IChain) => {
  const [res, err] = await getApi(`/contracts/${contract_address}/`, {
    environment: chain.env,
  });
  if (!err) return res;
};
