import { useMemo } from 'react';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import BlpAbi from '@Views/Earn/Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import { useActiveChain } from '@Hooks/useActiveChain';
import { divide } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useReadCall } from '@Utils/useReadCall';

export type otherBlpType = {
  price: string | null;
  supply: string | null;
  total_usdc: string | null;
  usdc_pol: string | null;
  usdc_total: string | null;
} | null;

export const useOtherChainCalls = () => {
  const { calls } = useDashboardCalls();
  const { configContracts } = useActiveChain();

  const { data } = useReadCall({
    contracts: calls,
    swrKey: 'useOtherChainCalls',
  });

  let response: {
    otherBLP: otherBlpType;
  } = {
    otherBLP: null,
  };

  if (data && data.length > 1) {
    let [blpTotalBalance, blpSupply, blpInitialRate, amountUSDCpool]: any[] =
      data;

    const blpPrice =
      blpSupply > 0
        ? divide(blpTotalBalance, blpSupply)
        : divide('1', blpInitialRate);

    response = {
      otherBLP: {
        price: blpPrice,
        supply: fromWei(blpSupply, configContracts.tokens['USDC'].decimals),
        total_usdc: fromWei(
          amountUSDCpool,
          configContracts.tokens['USDC'].decimals
        ),
        usdc_pol: fromWei(
          amountUSDCpool,
          configContracts.tokens['USDC'].decimals
        ),
        usdc_total: fromWei(
          amountUSDCpool,
          configContracts.tokens['USDC'].decimals
        ),
      },
    };
  }

  return response;
};

const useDashboardCalls = () => {
  const { activeChain, configContracts } = useActiveChain();

  const getCalls = () => {
    const calls: { [key: string]: any } = {
      blpTotalBalance: {
        address: configContracts.tokens['USDC'].pool_address,
        abi: BlpAbi,
        name: 'totalTokenXBalance',
        chainID: activeChain?.id,
      },
      blpSupply: {
        address: configContracts.tokens['USDC'].pool_address,
        abi: bfrAbi,
        name: 'totalSupply',
        chainID: activeChain?.id,
      },
      blpInitialRate: {
        address: configContracts.tokens['USDC'].pool_address,
        abi: BlpAbi,
        name: 'INITIAL_RATE',
        chainID: activeChain?.id,
      },
      amountUSDCpool: {
        address: configContracts.tokens['USDC'].address,
        abi: bfrAbi,
        name: 'balanceOf',
        params: [configContracts.tokens['USDC'].pool_address],
        chainID: activeChain?.id,
      },
    };
    return Object.keys(calls).map(function (key) {
      return calls[key];
    });
  };

  const calls = useMemo(() => getCalls(), [activeChain]);

  return { calls };
};
