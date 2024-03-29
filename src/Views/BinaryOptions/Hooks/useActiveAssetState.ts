import { useReadCall } from '@Utils/useReadCall';
import { setActiveAssetStateAtom, useQTinfo } from '..';
import ERC20ABI from '@Views/Earn/Config/Abis/Token.json';
import MaxTradeABI from '../ABI/MaxTrade.json';
import RouterABI from '../ABI/routerABI.json';
import ConfigABI from '../ABI/configABI.json';
import { getContract } from '../Address';
import { useBinaryActiveChainId } from './useBinaryActiveChainId';
import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { ethers } from 'ethers';
import BinaryOptionsABI from '../ABI/optionsABI.json';
import { toFixed } from '@Utils/NumString';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { knowTillAtom } from './useIsMerketOpen';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useActiveChain } from '@Hooks/useActiveChain';

export function useActiveAssetState(amount = null, referralData) {
  const { address: account } = useUserAccount();
  const qtInfo = useQTinfo();
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;

  const { activePoolObj } = useActivePoolObj();
  const [knowtil, setKnowTill] = useAtom(knowTillAtom);
  const setResInAtom = useSetAtom(setActiveAssetStateAtom);
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const payoutCalls = useMemo(() => {
    // return [];
    return qtInfo.pairs
      .map((pairObj) => {
        return pairObj.pools.map((pool, index) => {
          return {
            address: getContract(
              activeChainId,
              index === 0 ? 'USDC-reader' : 'BFR-reader'
            ),
            abi: MaxTradeABI,
            name: 'getPayout',
            params: [
              pool.options_contracts.current,
              referralData[2],
              // 'BJP',
              account || '0x0000000000000000000000000000000000000000',
              highestTierNFT?.tokenId || 0,
              true,
            ],
          };
        });
      })
      .flat(1);
  }, [referralData, account, highestTierNFT]);

  const routerPermissionCalls = useMemo(
    () =>
      qtInfo.pairs
        .map((pairObj) => {
          return pairObj.pools.map((pool) => {
            return {
              address: qtInfo.routerContract,
              abi: RouterABI,
              name: 'contractRegistry',
              params: [pool.options_contracts.current],
            };
          });
        })
        .flat(1),
    [activePoolObj]
  );

  const assetCalls = useMemo(
    () => [
      {
        address: getContract(
          activeChainId,
          activePoolObj.token.name === 'USDC' ? 'USDC-reader' : 'BFR-reader'
        ),
        abi: MaxTradeABI,
        name: 'calculateMaxAmount',
        params: [
          activePoolObj.options_contracts.current,
          highestTierNFT?.tokenId || 0,
          referralData[2],
          account || '0x0000000000000000000000000000000000000000',
        ],
      },
      {
        address: activePoolObj.options_contracts.current,
        abi: BinaryOptionsABI,
        name: 'fees',
        params: [
          (1e18).toString(),
          account || ethers.constants.AddressZero,
          true,
          referralData[2],
          highestTierNFT?.tokenId || 0,
        ],
      },
    ],
    [activePoolObj, account, referralData]
  );
  const userSpecificCalls = useMemo(
    () => [
      {
        address: activePoolObj.token.address,
        abi: ERC20ABI,
        name: 'balanceOf',
        params: [account],
      },
      {
        address: activePoolObj.token.address,
        abi: ERC20ABI,
        name: 'allowance',
        params: [account, qtInfo.routerContract],
      },
    ],
    [account, activePoolObj]
  );
  const marketStateCalls = useMemo(() => {
    // return [];
    const currDay = new Date().getUTCDay();
    // TODO verify Sunday - Saturday : 0 - 6

    return [
      {
        address: activePoolObj.options_contracts.config,
        abi: ConfigABI,
        name: 'marketTimes',
        params: [currDay.toString()],
      },
    ];
  }, [activePoolObj]);

  const calls = activePoolObj
    ? account
      ? [
          ...assetCalls,
          ...payoutCalls,
          ...routerPermissionCalls,
          ...marketStateCalls,
          ...userSpecificCalls,
        ]
      : [
          ...assetCalls,
          ...payoutCalls,
          ...routerPermissionCalls,
          ...marketStateCalls,
        ]
    : [];

  let copy = useReadCall({ contracts: calls, swrKey: 'UseActiveAssetState' })
    .data as unknown as string[];
  let response = [null, null, null, null];

  if (copy) {
    let [maxAmounts, fees] = copy.slice(0, assetCalls.length);

    //calculate maxTradeValue
    const maxTrade = maxAmounts?.[0]
      ? divide(
          gt(maxAmounts[0], maxAmounts[1]) ? maxAmounts[0] : maxAmounts[1],
          activePoolObj.token.decimals
        )
      : null;

    //multiply the userInput with 1e18
    let userInput = toFixed(
      multiply(+amount < 1 || !amount ? '1' : amount, 18),
      0
    );

    //calculate max_payout and max_loss
    const stats = fees?.[0] && {
      max_payout: divide(userInput, fees[0]),
      max_loss: amount || '0',
    };

    const payoutRes = copy.slice(
      assetCalls.length,
      assetCalls.length + payoutCalls.length
    );

    const payouts: { [key: string]: string | undefined | null } = {};
    qtInfo.pairs.forEach((pair) => {
      pair.pools.forEach((pool) => {
        payouts[pool.options_contracts.current] = divide(
          payoutRes.shift()?.[0] ?? '0',
          2
        );
      });
    });

    const routerPermissionRes = copy.slice(
      assetCalls.length + payoutCalls.length,
      assetCalls.length + payoutCalls.length + routerPermissionCalls.length
    );
    const routerPermission: { [key: string]: string | undefined } = {};
    qtInfo.pairs.forEach((pair) => {
      pair.pools.forEach((pool) => {
        routerPermission[pool.options_contracts.current] =
          routerPermissionRes.shift()?.[0];
      });
    });
    const marketStatusCalls = copy.slice(
      assetCalls.length + payoutCalls.length + routerPermissionCalls.length,
      assetCalls.length + payoutCalls.length + routerPermissionCalls.length + 1
    );
    if (marketStateCalls?.length) {
      const [openHour, openMin, closeHour, closeMin] =
        marketStatusCalls[0] as number[];

      const currentTime =
        new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
      const openTime = openHour * 60 + openMin;

      const closeTime = closeHour * 60 + closeMin;

      const closeTs = new Date();
      closeTs.setUTCHours(closeHour);
      closeTs.setUTCMinutes(closeMin);
      closeTs.setUTCSeconds(0);
      closeTs.setUTCMilliseconds(0);
      const openTs = new Date();
      openTs.setUTCHours(openHour);
      openTs.setUTCMinutes(openMin);
      openTs.setUTCSeconds(0);
      openTs.setUTCMilliseconds(0);
      let tempKnowTill = { date: -1, open: false };
      // o....t....c -  knowtill:c  ,market open knowtil c  Tested
      if (currentTime > openTime && currentTime < closeTime)
        tempKnowTill = { date: closeTs.getTime(), open: true };
      // TODO - Test
      // t o--------c - knowtill:o  ,market close knowtill o
      else if (currentTime < openTime && currentTime < closeTime)
        tempKnowTill = { date: openTs.getTime(), open: false };
      // TODO - Test
      // o.......c  t -  knowtill:-1  ,market close for the day knowtill:-1
      else if (currentTime > openTime && currentTime > closeTime)
        tempKnowTill = { date: -1, open: false };
      if (knowtil.date !== tempKnowTill.date) {
        setKnowTill(tempKnowTill);
      }
    }
    /*


 const timings = {
      openHour: 12,
      openMin: 0,
      closeHour: 18,
      closeMin: 0,
    };
    const currentTime =
      new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
    const openTime = timings.openHour * 60 + timings.openMin;
    const closeTime = timings.closeHour * 60 + timings.closeMin;

    const closeTs = new Date();
    closeTs.setUTCHours(timings.closeHour);
    closeTs.setUTCMinutes(timings.closeMin);
    const openTs = new Date();
    openTs.setUTCHours(timings.closeHour);
    openTs.setUTCMinutes(timings.closeMin);
    // o....t....c -  knowtill:c  ,market open knowtil c
    if (currentTime > openTime && currentTime < closeTime)
      setKnowTill({ date: closeTs.getTime(), open: true });
    // t o--------c - knowtill:o  ,market close knowtill o
    else if (currentTime < openTime && currentTime < closeTime)
      setKnowTill({ date: openTs.getTime(), open: false });
    // o.......c  t -  knowtill:-1  ,market close for the day knowtill:-1
    else if (currentTime > openTime && currentTime > closeTime)
      setKnowTill({ date: -1, open: false });


*/
    //destructuring the account response
    const [balance, allowance] = account
      ? copy.slice(-userSpecificCalls.length)
      : new Array(userSpecificCalls.length).fill(null);

    setResInAtom({
      balance,
      allowance,
      maxTrade,
      stats,
      payouts,
      routerPermission,
    });
    //update response
    response = [balance, allowance, maxTrade, stats, routerPermission];
  }

  return response;
}
