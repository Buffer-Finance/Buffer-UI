// @ts-nocheck
import { CHAIN_CONFIGS } from "config";
import sample from "lodash/sample";
import Web3 from "web3";

// Array of available nodes to connect to
const getProvider = (chain?: string) => {
  // let url = sample(CHAIN_CONFIGS[import.meta.env.VITE_ENV][chain].rpcUrls);
  return new Web3("https://rpc-mumbai.maticvigil.com/");
};

export default getProvider;
