import { useContext, useMemo } from 'react';
import { CONTRACTS } from '@Views/Earn/Config/Address';
import { CONTRACTS as DASHBOARDCONTRACTS } from '@Views/Dashboard/config/Addresses';
import { DashboardContext } from '../dashboardAtom';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import poolABI from '@Views/BinaryOptions/ABI/poolABI.json';
import { erc20ABI, useContractReads } from 'wagmi';
import * as chain from '@wagmi/core/chains';
import Config from 'public/config.json'
import { convertBNtoString, useReadCall } from '@Utils/useReadCall';
import {
  BASIS_POINTS_DIVISOR,
  fromWei,
  SECONDS_PER_YEAR,
  useIbfrPrice,
} from '@Views/Earn/Hooks/useTokenomicsMulticall';
import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { IBFR, IBLP, IOverview, ITotalStats } from '../interface';
import BlpAbi from '@Views/Earn/Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import { useDashboardGraphQl } from './useDashboardGraphQl';
import useSWR from 'swr';
import { multicallv2 } from '@Utils/Contract/multiContract';
import { ethers } from 'ethers';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import { useActiveChain } from '@Hooks/useActiveChain';
export const HolderContracts = [
  '0x01fdd6777d10dD72b8dD716AEE05cE67DD2b7D85',
  '0x58b0F2445DfA2808eCB209B7f96EfBc584736b7D',
  '0x63B045c2c53Eb7732341a96a496DF1Cf423E11bA',
  '0x5558CD6480A63601EC780D8f40FD7cD97dea48a7',
  '0x973Fe046eAE0b685F13A02eA2620CAc23C4Ca6AA',
  '0x92f424a2A65efd48ea57b10D345f4B3f2460F8c8',
  '0x1Ad98D5dC4d6f49B562f02482E8BeCB9ff166734',
  '0xB529f885260321729D9fF1C69804c5Bf9B3a95A5',
  '0xAaAc379C2Fc98F59bdf26BD4604d4F084310b23D',
  '0x47ECF602a62BaF7d4e6b30FE3E8dD45BB8cfFadc',
  '0x691FA1d4dc25f39a22Dc45Ca98080CF21Ca7eC64',
  '0x97dcc5574B76b91008b684C58DfdF95fE39FA772',
  '0x3A3DA6464bEe25a1d98526402a12241B0787b84C',
  //   "0x173817F33f1C09bCb0df436c2f327B9504d6e067",
];
export const useDashboardReadCalls = () => {
  const bfrPrice = useIbfrPrice();
  const {
    BFRstats,
    USDCstats,
    totalTraders,
    isGqlDataAvailable,
    BFR24stats,
    USDC24stats,
  } = useDashboardGraphQl();
  const usd_decimals = 6;

  const { calls, mainnetData } = useDashboardCalls();

  const { data } = useReadCall({
    contracts: calls,
  });
  // convertBNtoString(data);
  console.log(`data: `, data);

  let response: {
    BFR: IBFR;
    BLP: IBLP;
    overView: IOverview;
    total: ITotalStats;
  } = {
    BFR: null,
    BLP: null,
    overView: null,
    total: null,
  };
  if (data && data.length > 1) {
    let [
      totalStakedBFR,
      totalSupplyBFR,
      blpTotalBalance,
      blpSupply,
      blpInitialRate,
      totalStakedBLP,
      totalSupplyBLP,
      amountUSDCpool,
      amountBFRpool,
      feeBlpTrackerTokensPerInterval,
      stakedBlpTrackerTokensPerInterval,
      USDCvaultPOL,
      BFRvaultPOL,
    ]: any[] = data;

    const blpPrice =
      blpSupply > 0
        ? divide(blpTotalBalance, blpSupply)
        : divide('1', blpInitialRate);

    const totalUSDCstaked = multiply(
      fromWei(totalStakedBLP, usd_decimals),
      blpPrice
    );

    const feeBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(feeBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
      usd_decimals
    );
    const blpAprForRewardToken =
      blpSupply > 0
        ? divide(
            multiply(feeBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(blpSupply, blpPrice), usd_decimals)
          )
        : '0';
    const stakedBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(
        multiply(stakedBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
        bfrPrice
      )
    );
    const blpAprForEsBfr =
      blpSupply > 0
        ? divide(
            multiply(stakedBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(blpSupply, blpPrice), usd_decimals)
          )
        : '0';
    const blpAprTotal = add(blpAprForRewardToken, blpAprForEsBfr);

    response = {
      overView: null,
      total: null,
      BFR: {
        price: bfrPrice,
        supply: fromWei(totalSupplyBFR),
        total_staked: fromWei(totalStakedBFR),
        market_cap: multiply(bfrPrice, fromWei(totalSupplyBFR)),
        circulatingSupply: mainnetData?.circulatingSupply
          ? '' + mainnetData.circulatingSupply
          : null,
        liquidity_pools_token: mainnetData?.lpTokens,
      },
      BLP: {
        price: blpPrice,
        supply: fromWei(totalSupplyBLP, usd_decimals),
        total_staked: totalUSDCstaked,
        market_cap: multiply(blpPrice, fromWei(totalSupplyBLP, usd_decimals)),
        apr: fromWei(blpAprTotal, 2),
        total_usdc: fromWei(amountUSDCpool, usd_decimals),
      },
    };

    if (isGqlDataAvailable) {
      const isUSDCnull = !USDCstats;
      const isBFRnull = !BFRstats;
      const usdcVolume = isUSDCnull
        ? '0'
        : fromWei(USDCstats.totalVolume, usd_decimals);
      const bfrVolume = isBFRnull ? '0' : fromWei(BFRstats.totalVolume);
      const totalVolume = add(usdcVolume, bfrVolume);
      const totalTrades = isUSDCnull
        ? '0'
        : (
            (USDCstats.totalTrades || 0) + (BFRstats?.totalTrades || 0)
          ).toString();

      const avgTrade = divide(totalVolume, totalTrades);

      response = {
        ...response,
        total: {
          USDCfees: isUSDCnull
            ? '0'
            : fromWei(USDCstats.totalSettlementFees, usd_decimals),
          BFRfees: isBFRnull ? '0' : fromWei(BFRstats.totalSettlementFees),
          USDCvolume: usdcVolume,
          BFRvolume: bfrVolume,
          avgTrade: avgTrade,
          totalTraders: totalTraders[0]?.uniqueCountCumulative || 0,
        },
        overView: {
          price: blpPrice,
          bfr_pol: BFRvaultPOL ? fromWei(BFRvaultPOL) : null,
          usdc_pol: USDCvaultPOL ? fromWei(USDCvaultPOL, usd_decimals) : null,
          bfr_total: fromWei(amountBFRpool),
          usdc_total: fromWei(amountUSDCpool, usd_decimals),
          usdc_vault: fromWei(amountUSDCpool, usd_decimals),
          bfr_vault: multiply(fromWei(amountBFRpool), bfrPrice),
          usdc_24_fees: USDC24stats
            ? fromWei(USDC24stats.settlementFee, usd_decimals)
            : '0',
          usdc_24_volume: USDC24stats
            ? fromWei(USDC24stats.amount, usd_decimals)
            : '0',
          bfr_24_fees: BFR24stats ? fromWei(BFR24stats.settlementFee) : '0',
          bfr_24_volume: BFR24stats ? fromWei(BFR24stats.amount) : '0',
        },
      };
    }
  }

  return response;
};

const useDashboardCalls = () => {
  const { activeChain } = useContext(DashboardContext);
  const {configContracts} = useActiveChain();
  const earnContracts = CONTRACTS[activeChain?.id];
  const earnMainnetContracts = CONTRACTS[chain.arbitrum.id];
  const dashboardContracts: (typeof DASHBOARDCONTRACTS)[42161] =
    DASHBOARDCONTRACTS[activeChain?.id];
  const binaryContracts = configContracts;

  const getCalls = () => {
    const calls = {
      totalStakedBFR: {
        address: earnContracts.iBFR,
        abi: bfrAbi,
        name: 'balanceOf',
        params: [earnContracts.StakedBfrTracker],
        chainID: activeChain?.id,
      },
      totalSupplyBFR: {
        address: earnContracts.iBFR,
        abi: bfrAbi,
        name: 'totalSupply',
        chainID: activeChain?.id,
      },
      blpTotalBalance: {
        address: earnContracts.BLP,
        abi: BlpAbi,
        name: 'totalTokenXBalance',
        chainID: activeChain?.id,
      },
      blpSupply: {
        address: earnContracts.BLP,
        abi: bfrAbi,
        name: 'totalSupply',
        chainID: activeChain?.id,
      },
      blpInitialRate: {
        address: earnContracts.BLP,
        abi: BlpAbi,
        name: 'INITIAL_RATE',
        chainID: activeChain?.id,
      },
      totalStakedBLP: {
        address: earnContracts.BLP,
        abi: bfrAbi,
        name: 'balanceOf',
        params: [earnContracts.FeeBlpTracker],
      },
      totalSupplyBLP: {
        address: earnContracts.BLP,
        abi: bfrAbi,
        name: 'totalSupply',
        chainID: activeChain?.id,
      },
      amountUSDCpool: {
        address: binaryContracts.tokens['USDC'].address,
        abi: bfrAbi,
        name: 'balanceOf',
        params: [binaryContracts.tokens['USDC'].pool_address],
        chainID: activeChain?.id,
      },
      amountBFRpool: {
        address: binaryContracts.tokens['BFR'].address,
        abi: bfrAbi,
        name: 'balanceOf',
        params: [binaryContracts.tokens['BFR'].pool_address],
        chainID: activeChain?.id,
      },
      feeBlpTrackerTokensPerInterval: {
        address: earnContracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        name: 'tokensPerInterval',
        chainID: activeChain?.id,
      },
      stakedBlpTrackerTokensPerInterval: {
        address: earnContracts.StakedBlpTracker,
        abi: RewardTrackerAbi,
        name: 'tokensPerInterval',
        chainID: activeChain?.id,
      },

      USDCvaultPOL: {
        address: earnContracts.StakedBlpTracker,
        abi: RewardTrackerAbi,
        name: 'depositBalances',
        params: [
          dashboardContracts.usdcLiquidityAddress,
          earnContracts.FeeBlpTracker,
        ],
        chainID: activeChain?.id,
      },
      BFRvaultPOL: {
        address: binaryContracts.tokens['BFR'].pool_address,
        abi: poolABI,
        name: 'shareOf',
        params: [dashboardContracts.bfrLiquidityAddress],
        chainID: activeChain?.id,
      },
    };
    return Object.keys(calls).map(function (key) {
      return calls[key];
    });
  };

  const calls = useMemo(
    () => getCalls(),
    [activeChain, earnContracts, binaryContracts, dashboardContracts]
  );

  //Fetches BFR circultaing supply
  const { data: mainnetData, error: cirError } = useSWR('circulatingSupply', {
    fetcher: async () => {
      const lpTokensCalls = [
        {
          address: earnMainnetContracts.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [dashboardContracts.uniswap],
        },
        {
          address: earnMainnetContracts.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [dashboardContracts.xcal],
        },
        {
          address: earnMainnetContracts.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [dashboardContracts.camelot],
        },
        {
          address: earnMainnetContracts.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [dashboardContracts.JLPPoolAddress],
        },
        {
          address: earnMainnetContracts.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [dashboardContracts.LBTPoolAddress],
        },
      ];
      const calls = HolderContracts.map((c) => {
        return {
          address: '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D',
          abi: erc20ABI,
          name: 'balanceOf',
          params: [c],
        };
      });
      const contracts = [...calls, ...lpTokensCalls];

      const multicallRes = await multicallv2(
        contracts,
        new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'),
        Config[42161].multicall
      );
      const lpTokensCallLength = lpTokensCalls.length;
      const formattedRes = multicallRes.slice(0, -lpTokensCallLength);

      const sum = formattedRes.reduce((t: string, num: string) => {
        return add(t, fromWei(num) || '0');
      }, '0');

      const lpTokens = multicallRes
        .slice(-lpTokensCallLength)
        .reduce((t: string, num: string) => {
          return add(t, fromWei(num) || '0');
        }, '0');
      // console.log(`lpTokens: `, sum, lpTokens);

      return {
        circulatingSupply: subtract('100000000', sum),
        lpTokens,
      };
    },
    refreshInterval: 10000,
  });
  console.log(`mainnetData: `, mainnetData);

  return { calls, mainnetData };
};
