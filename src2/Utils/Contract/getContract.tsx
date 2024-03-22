import { Contract } from "ethers";

const getContract = (abi: any, address: string, web3) => {
  if (!abi || !address) return null;
  if (web3) return new web3.eth.Contract(abi, address);
};
export default getContract;
