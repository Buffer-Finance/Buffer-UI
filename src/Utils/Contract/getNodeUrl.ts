import Web3 from "web3";
import { CHAIN_CONFIG } from "config";
// Array of available nodes to connect to
const getNodeUrl = (chain: string) => {
  if (!chain) return null;

  return new Web3(
    CHAIN_CONFIG[chain].rpcUrls[0] || "https://bsc-dataseed1.binance.org/"
  );
};

export default getNodeUrl;
