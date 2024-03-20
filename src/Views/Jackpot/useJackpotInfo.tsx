import { erc20ABI, useContractReads } from 'wagmi';
import JackpotABI from '@ABIs/JackpotABI.json';
import { appConfig } from '@Views/TradePage/config';
import { isTestnet } from 'config';
const JackpotToken = 'ARB';
const defaultOp = -1;
const useJackpotInfo = () => {
  const [ARBPoolAds, token] = getARBPool();
  const args = [token.tokenAddress];
  const res = useContractReads({
    contracts: [
      {
        address: '0x65024158941e15283a376F69E40dED61F522cb51',
        abi: JackpotABI,
        functionName: 'minBetSizeForJackpot',
        args: args,
      },
      {
        address: args[0],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: ['0x65024158941e15283a376F69E40dED61F522cb51'],
      },
    ],
    select: (data) => {
      if (data[0].status == 'success')
        return {
          minSize: BigDivide(data[0].result),
          poolBalance: BigDivide(data[1].result),
        };
      else {
        return {};
      }
    },
  });
  return res.data;
};

export { useJackpotInfo };
const getARBPool = () => {
  const ARBPool = Object.entries(
    appConfig[isTestnet ? '421614' : '42161'].poolsInfo
  ).filter(([k, v]) => {
    if (v.token === JackpotToken) {
      return true;
    }
    return false;
  });
  return ARBPool[0];
};

const BigDivide = (num) => {
  if (!num) return undefined;
  return BigInt(num) / BigInt(10 ** 18);
};
