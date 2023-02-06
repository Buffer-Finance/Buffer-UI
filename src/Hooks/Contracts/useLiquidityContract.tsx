import { useCallback, useEffect, useState } from 'react';
import { useGlobal } from '@Contexts/Global';
import { IContract, updateProps } from 'src/Interfaces/interfaces';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useWeb3React } from '@web3-react/core';
import { getPosInf } from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { useAccount } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';
// import { multicall } from '@Hooks/Utilities/multicall'

export function useLiquidityWriteCalls() {
  const { address: account } = useUserAccount();

  const { state } = useGlobal();
  const { writeCall } = useWriteCall();
  // useEffect(() => {
  //   if (!state.contracts) return
  //   if (!state.settings.activeAsset.name) return
  //   const res = state.contracts.liquidity_pools[0]
  //   setActiveContractArgs({ abi: res.abi, address: res.address })
  // }, [state.contracts.liquidity_pools, state.settings.activeAsset.name])

  const provide = useCallback(
    (
      contract,
      minMint,
      amount: string,
      update: (props: updateProps) => void
    ) => {
      writeCall(update, contract, 'provide', [minMint, account], {
        value: amount,
      });
    },
    [account]
  );
  const provideOtherToken = useCallback(
    (
      contract,
      minMint,
      amount: string,
      update: (props: updateProps) => void
    ) => {
      writeCall(update, contract, 'provide', [amount, minMint]);
    },
    [account]
  );
  const withdraw = useCallback(
    async (
      contract,
      amount: string,
      maxBurn: string,
      update: (props: updateProps) => void
    ) => {
      writeCall(update, contract, 'withdraw', [amount, maxBurn]);
    },
    [account]
  );
  const approve = (
    approvedTo: string,
    contract,
    ammount: string,
    update: (props: updateProps) => void
  ) => {
    writeCall(update, contract, 'approve', [approvedTo, ammount]);
  };

  const getLiquidityState = useCallback(async () => {
    return null;
    // const res = await multicall(getContractCalls(activeContractArgs.address, account, activeContractArgs.abi), library)
    // return res
  }, [account]);
  return { provide, withdraw, getLiquidityState, provideOtherToken, approve };
}

export const methods = [
  'lockedPremium',
  'totalSupply',
  'totalBalance',
  'INITIAL_RATE',
  'balanceOf',
  'availableBalance',
  'lockupPeriod',
  'lastProvideTimestamp',
  'shareOf',
];
const factor = 1e18;
