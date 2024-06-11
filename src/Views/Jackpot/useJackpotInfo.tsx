import { erc20ABI, useContractReads } from 'wagmi';
import JackpotABI from '@ABIs/JackpotABI.json';
import { JackpotAdds, appConfig } from '@Views/TradePage/config';
import { isTestnet } from 'config';
const JackpotToken = 'ARB';
const defaultOp = -1;
const useJackpotInfo = () => {
  const [ARBPoolAds, token] = getARBPool();
  const [USDCPoolAds, usdc] = getUSDCPool();
  const [_, usdce] = getUSDCEPool();

  const args = [token.tokenAddress];
  const res = useContractReads({
    contracts: [
      {
        address: JackpotAdds,
        abi: JackpotABI,
        functionName: 'minBetSizeForJackpot',
        args: args,
      },
      {
        address: args[0],
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [JackpotAdds],
      },
      {
        address: JackpotAdds,
        abi: JackpotABI,
        functionName: 'minBetSizeForJackpot',
        args: [usdc.tokenAddress],
      },
      {
        address: JackpotAdds,
        abi: JackpotABI,
        functionName: 'minBetSizeForJackpot',
        args: [usdce.tokenAddress],
      },
    ],
    select: (data) => {
      if (data[0].status == 'success')
        return {
          minSize: BigDivide(data[0].result),
          minSizes: {
            ARB: BigDivide(data[0].result),
            USDC: BigDivide6(data[2].result),
            'USDC.e': BigDivide6(data[3].result),
          },
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
const getUSDCPool = () => {
  const USDCPool = Object.entries(
    appConfig[isTestnet ? '421614' : '42161'].poolsInfo
  ).filter(([k, v]) => {
    if (v.token === 'USDC') {
      return true;
    }
    return false;
  });
  return USDCPool[0];
};
const getUSDCEPool = () => {
  const USDCPool = Object.entries(
    appConfig[isTestnet ? '421614' : '42161'].poolsInfo
  ).filter(([k, v]) => {
    if (v.token === 'USDC.e') {
      return true;
    }
    return false;
  });
  return USDCPool[0];
};

const BigDivide = (num) => {
  if (!num) return 0n;
  return BigInt(num) / BigInt(10 ** 18);
};
const BigDivide6 = (num) => {
  if (!num) return 0n;
  return BigInt(num) / BigInt(10 ** 6);
};
