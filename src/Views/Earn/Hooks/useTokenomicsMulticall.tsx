import bfrAbi from '../Config/Abis/BFR.json';
import VesterAbi from '../Config/Abis/Vester.json';
import RewardTrackerAbi from '../Config/Abis/RewardTracker.json';
import BlpAbi from '../Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import TokenAbi from '../Config/Abis/Token.json';
import { CONTRACTS } from '../Config/Address';
import useSWR from 'swr';
import axios from 'axios';
import { convertBNtoString } from '@Utils/useReadCall';
import {
  add,
  divide,
  gt,
  gte,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { eToWide, toFixed } from '@Utils/NumString';
import { useContractReads } from 'wagmi';
import { EarnContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';

const ibfrPriceCache = {
  cache: '0',
};
export const useIbfrPrice = () => {
  const getBothPrice = async () => {
    const response = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev',
      {
        operationName: 'pools',
        variables: {},
        query:
          'query pools {\n  pools(\n    where: {id_in: ["0xc31e54c7a869b9fcbecc14363cf510d1c41fa443", "0x17c14d2c404d167802b16c450d3c99f88f2c4f4d", "0xb529f885260321729d9ff1c69804c5bf9b3a95a5"]}\n  ) {\n    id\n    token1Price\n  }\n}\n',
      }
    );
    return multiply(
      response.data.data.pools[0].token1Price,
      response.data.data.pools[1].token1Price
    );
  };

  const keys = ['bfrPriceInEth'];

  const { data, error } = useSWR(keys, {
    fetcher: async (calls) => {
      const res = await getBothPrice();

      return res;
    },
  });

  if (data && !error) {
    ibfrPriceCache.cache = toFixed(data, 8);
  }
  return ibfrPriceCache.cache;
};

export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals);
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetTokenomics = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(EarnContext);
  // const { state } = useGlobal();
  const contracts = CONTRACTS[activeChain?.id];
  const bfrPrice = useIbfrPrice();
  const usd_decimals = 6;

  const getUserSpecificCalls = () => {
    if (!activeChain || !contracts) return [];
    const user_specific_data = {
      userStakedBFR: {
        address: contracts.StakedBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.iBFR],
      },
      bfrInWallet: {
        address: contracts.iBFR,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      stakedBFRTrackerRewards: {
        address: contracts.StakedBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },
      feeBFRTrackerRewards: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },
      feeBlpTrackerRewards: {
        address: contracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },
      bfrVesterRewards: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'claimable',
        args: [account],
      },
      blpVesterRewards: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'claimable',
        args: [account],
      },
      stakedBlpTrackerRewards: {
        address: contracts.StakedBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },
      bonusBfrTrackerRewards: {
        address: contracts.BonusBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },
      userStakedBlp: {
        address: contracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.BLP],
      },
      esBFRInWallet: {
        address: contracts.ES_BFR,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      stakedEsBFR: {
        address: contracts.StakedBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.ES_BFR],
      },
      bnBfrInFeeBfr: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.BN_BFR],
      },
      bonusBfrInFeeBfr: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.BonusBfrTracker],
      },
      bfrVesterPairAmount: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'pairAmounts',
        args: [account],
      },
      bfrVesterVestedAmount: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'getVestedAmount',
        args: [account],
      },
      bfrVesterClaimedAmounts: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'claimedAmounts',
        args: [account],
      },
      bfrVesterClaimable: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'claimable',
        args: [account],
      },
      blpVesterPairAmount: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'pairAmounts',
        args: [account],
      },
      blpVesterVestedAmount: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'getVestedAmount',
        args: [account],
      },
      blpVesterClaimedAmounts: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'claimedAmounts',
        args: [account],
      },
      blpVesterClaimable: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'claimable',
        args: [account],
      },
      userUsdcBalance: {
        address: contracts.USDC,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userBlpBalance: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      bfrMaxVestableAmount: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'getMaxVestableAmount',
        args: [account],
      },
      blpMaxVestableAmount: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'getMaxVestableAmount',
        args: [account],
      },
      feeBlpTrackerUserBalance: {
        address: contracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      stakedBlpTrackerUserBalance: {
        address: contracts.StakedBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      stakedMultiplierPoints: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'depositBalances',
        args: [account, contracts.BN_BFR],
      },
      userUnlockedBlpAmount: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'getUnlockedLiquidity',
        args: [account],
      },
      bfrVesterAverageStakedAmount: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'getCombinedAverageStakedAmount',
        args: [account],
      },
      blpVesterAverageStakedAmount: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'getCombinedAverageStakedAmount',
        args: [account],
      },
      blpUsdcAllowance: {
        //blp-buy modal
        address: contracts.USDC, //token
        abi: TokenAbi,
        functionName: 'allowance',
        args: [account, contracts.BLP], //spender
        watch: true,
      },
      bfrStakedBfrTrackerAllowance: {
        //bfr-stake modal
        address: contracts.iBFR, //token
        abi: bfrAbi,
        functionName: 'allowance',
        args: [account, contracts.StakedBfrTracker], //spender
        watch: true,
      },
      esbfrStakedBfrTrackerAllowance: {
        //esbfr-stake modal && bfr-deposit modal
        address: contracts.ES_BFR, //token
        abi: bfrAbi,
        functionName: 'allowance',
        args: [account, contracts.StakedBfrTracker], //spender
        watch: true,
      },
      esbfrStakedBlpTrackerAllowance: {
        //blp-deposit modal
        address: contracts.ES_BFR, //token
        abi: bfrAbi,
        functionName: 'allowance',
        args: [account, contracts.StakedBlpTracker], //spender
        watch: true,
      },
      feeBfrTrackerUserBalance: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'balanceOf',
        args: [account],
      },
    };
    return Object.keys(user_specific_data).map(function (key) {
      return user_specific_data[key];
    });
  };
  const getcalls = () => {
    const userSpecificCalls = getUserSpecificCalls();
    if (!activeChain || !contracts) return [];
    const generic_call_data = {
      totalStakedBFR: {
        address: contracts.iBFR,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [contracts.StakedBfrTracker],
      },
      totalBFRSupply: {
        address: contracts.iBFR,
        abi: bfrAbi,
        functionName: 'totalSupply',
      },
      stakedBlp: {
        address: contracts.BLP,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [contracts.FeeBlpTracker],
      },
      blpSupply: {
        address: contracts.BLP,
        abi: bfrAbi,
        functionName: 'totalSupply',
      },
      stakedBFRTrakerSupply: {
        address: contracts.StakedBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'totalSupply',
      },
      stakedBfrDistributorBalance: {
        address: contracts.ES_BFR,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [contracts.StakedBfrDistributor],
      },
      stakedBlpDistributorBalance: {
        address: contracts.ES_BFR,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [contracts.StakedBlpDistributor],
      },
      esBFRSupply: {
        address: contracts.ES_BFR,
        abi: bfrAbi,
        functionName: 'totalSupply',
      },
      feeBfrTrackerTokensPerInterval: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'tokensPerInterval',
      },
      feeBfrSupply: {
        address: contracts.FeeBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'totalSupply',
      },
      stakedBfrTrackerTokensPerInterval: {
        address: contracts.StakedBfrTracker,
        abi: RewardTrackerAbi,
        functionName: 'tokensPerInterval',
      },
      feeBlpTrackerTokensPerInterval: {
        address: contracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'tokensPerInterval',
      },
      stakedBlpTrackerTokensPerInterval: {
        address: contracts.StakedBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'tokensPerInterval',
      },
      bfrVesterPairToken: {
        address: contracts.BfrVester,
        abi: VesterAbi,
        functionName: 'pairToken',
      },
      blpVesterPairToken: {
        address: contracts.BlpVester,
        abi: VesterAbi,
        functionName: 'pairToken',
      },
      blpTotalBalance: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'totalTokenXBalance',
      },
      maxTokenXToWithdraw: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'availableBalance',
      },
      blpInitialRate: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'INITIAL_RATE',
      },
      blpLockupPeriod: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'lockupPeriod',
      },
      blpMaxLiquidity: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'maxLiquidity',
      },
    };
    return Object.keys(generic_call_data)
      .map(function (key) {
        return generic_call_data[key];
      })
      .concat(account ? userSpecificCalls : []);
  };
  const isVestable = (
    vesterAverageStakedAmount,
    maxVestableAmount,
    feeBfrTrackerUserBalance,
    esBFRInWallet,
    vesterPairAmount
  ) => {
    let pairAmountDiff = '0';
    let nextPairAmount =
      vesterAverageStakedAmount == '0' || maxVestableAmount == '0'
        ? '0'
        : divide(
            multiply(esBFRInWallet, vesterAverageStakedAmount),
            maxVestableAmount
          );
    if (gt(nextPairAmount, vesterPairAmount)) {
      pairAmountDiff = subtract(nextPairAmount, vesterPairAmount);
    }
    let vesterHasEnoughReserveTokens = gt(
      feeBfrTrackerUserBalance,
      pairAmountDiff
    );

    return vesterHasEnoughReserveTokens;
  };

  const calls = getcalls().map((call) => {
    return { ...call, chainId: activeChain.id };
  });
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  // if (data)
  convertBNtoString(data);

  let response = {};
  if (data && data[0] && bfrPrice && gt(bfrPrice, '0')) {
    let [
      totalStakedBFR,
      totalBFRSupply,
      stakedBlp,
      blpSupply,
      stakedBFRTrakerSupply,
      stakedBfrDistributorBalance,
      stakedBlpDistributorBalance,
      esBFRSupply,
      feeBfrTrackerTokensPerInterval,
      feeBfrSupply,
      stakedBfrTrackerTokensPerInterval,
      feeBlpTrackerTokensPerInterval,
      stakedBlpTrackerTokensPerInterval,
      bfrVesterPairToken,
      blpVesterPairToken,
      blpTotalBalance,
      maxTokenXToWithdraw,
      blpInitialRate,
      blpLockupPeriod,
      blpMaxLiquidity,
      // User specifics
      userStakedBFR,
      bfrInWallet,
      stakedBFRTrackerRewards,
      feeBFRTrackerRewards,
      feeBlpTrackerRewards,
      bfrVesterRewards,
      blpVesterRewards,
      stakedBlpTrackerRewards,
      bonusBfrTrackerRewards,
      userStakedBlp,
      esBFRInWallet,
      stakedEsBFR,
      bnBfrInFeeBfr,
      bonusBfrInFeeBfr,
      bfrVesterPairAmount,
      bfrVesterVestedAmount,
      bfrVesterClaimedAmounts,
      bfrVesterClaimable,
      blpVesterPairAmount,
      blpVesterVestedAmount,
      blpVesterClaimedAmounts,
      blpVesterClaimable,
      userUsdcBalance,
      userBlpBalance,
      bfrMaxVestableAmount,
      blpMaxVestableAmount,
      feeBlpTrackerUserBalance,
      stakedBlpTrackerUserBalance,
      stakedMultiplierPoints,
      userUnlockedBlpAmount,
      bfrVesterAverageStakedAmount,
      blpVesterAverageStakedAmount,
      blpUsdcAllowance,
      bfrStakedBfrTrackerAllowance,
      esbfrStakedBfrTrackerAllowance,
      esbfrStakedBlpTrackerAllowance,
      feeBfrTrackerUserBalance,
    ] = account
      ? data.flat()
      : data.concat(new Array(getUserSpecificCalls().length).fill('0')).flat();


    const blpPrice =
      blpSupply > 0
        ? divide(blpTotalBalance, blpSupply)
        : divide('1', blpInitialRate);

    const boostBasisPoints =
      bonusBfrInFeeBfr > 0
        ? divide(
            multiply(bnBfrInFeeBfr, BASIS_POINTS_DIVISOR),
            bonusBfrInFeeBfr
          )
        : '0';

    // BFR APR
    const stakedBfrTrackerAnnualRewardsUsd = fromWei(
      multiply(
        multiply(stakedBfrTrackerTokensPerInterval, SECONDS_PER_YEAR),
        bfrPrice
      )
    );
    const bfrAprForEsBfr = gt(multiply(stakedBFRTrakerSupply, bfrPrice), '0')
      ? divide(
          multiply(stakedBfrTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
          fromWei(multiply(stakedBFRTrakerSupply, bfrPrice))
        )
      : '0';
    const feeBfrTrackerAnnualRewardsUsd = fromWei(
      multiply(feeBfrTrackerTokensPerInterval, SECONDS_PER_YEAR),
      usd_decimals
    );
    const bfrAprForRewardToken =
      feeBfrSupply > 0
        ? divide(
            multiply(feeBfrTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(feeBfrSupply, bfrPrice))
          )
        : '0';

    const bfrBoostAprForRewardToken = divide(
      multiply(bfrAprForRewardToken, boostBasisPoints),
      BASIS_POINTS_DIVISOR
    );
    const bfrAprTotalWithBoost = add(
      add(bfrAprForRewardToken, bfrBoostAprForRewardToken),
      bfrAprForEsBfr
    );

    // BLP APR
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

    // Unstakeable max amount
    const availableTokens = fromWei(
      subtract(add(bnBfrInFeeBfr, bonusBfrInFeeBfr), bfrVesterPairAmount)
    );
    const multiplierPointsAmount = add(bonusBfrTrackerRewards, bnBfrInFeeBfr);
    const stakedTokens = bonusBfrInFeeBfr;
    const divisor = add(multiplierPointsAmount, stakedTokens);
    let maxUnstakeableBfr = availableTokens;
    // if (gt(divisor, "0")) {
    //   maxUnstakeableBfr = divide(
    //     multiply(availableTokens, stakedTokens),
    //     divisor
    //   );
    // }

    const maxUnstakableEsBfr = gt(fromWei(stakedEsBFR), maxUnstakeableBfr)
      ? maxUnstakeableBfr
      : fromWei(stakedEsBFR);
    maxUnstakeableBfr = gt(fromWei(userStakedBFR), maxUnstakeableBfr)
      ? maxUnstakeableBfr
      : fromWei(userStakedBFR);

    // MaX vestable amount
    let bfrRemainingVestableAmount = subtract(
      bfrMaxVestableAmount,
      bfrVesterVestedAmount
    );
    if (lt(esBFRInWallet, bfrRemainingVestableAmount)) {
      bfrRemainingVestableAmount = esBFRInWallet;
    }
    let blpRemainingVestableAmount = subtract(
      blpMaxVestableAmount,
      blpVesterVestedAmount
    );
    if (lt(esBFRInWallet, blpRemainingVestableAmount)) {
      blpRemainingVestableAmount = esBFRInWallet;
    }

    // MaX withdrawal
    const dividedValue = divide(maxTokenXToWithdraw, blpPrice);
    let maxBlpToWithdraw = lt(userUnlockedBlpAmount, dividedValue)
      ? userUnlockedBlpAmount
      : dividedValue;

    let maxUnstakeableBlp = subtract(userStakedBlp, blpVesterPairAmount);
    if (gt(maxBlpToWithdraw, maxUnstakeableBlp)) {
      maxBlpToWithdraw = maxUnstakeableBlp;
    }

    // FORMATTING
    response = {
      earn: {
        usdc: {
          allowance: fromWei(blpUsdcAllowance, usd_decimals),
          wallet_balance: fromWei(userUsdcBalance, usd_decimals),
        },
        ibfr: {
          price: bfrPrice,
          apr: {
            value: fromWei(bfrAprTotalWithBoost, 2),
            tooltip: gt(bfrBoostAprForRewardToken, '0')
              ? [
                  {
                    key: 'Boosted APR',
                    value: fromWei(bfrBoostAprForRewardToken, 2),
                  },
                  {
                    key: 'Escrowed BFR APR',
                    value: fromWei(bfrAprForEsBfr, 2),
                  },
                  {
                    key: 'Base USDC APR',
                    value: fromWei(bfrAprForRewardToken, 2),
                  },
                  {
                    key: 'Total APR',
                    value: fromWei(bfrAprTotalWithBoost, 2),
                  },
                ]
              : [
                  {
                    key: 'Escrowed BFR APR',
                    value: fromWei(bfrAprForEsBfr, 2),
                  },
                  {
                    key: 'USDC APR',
                    value: fromWei(bfrAprForRewardToken, 2),
                  },
                ],
            description: gt(bfrBoostAprForRewardToken, '0')
              ? 'The Boosted APR is from your staked Multiplier Points. APRs are updated weekly on Wednesday and will depend on the fees collected for the week.'
              : 'APRs are updated weekly on Wednesday and will depend on the fees collected for the week.',
          },
          max_unstakeable: maxUnstakeableBfr,
          boost_percentage: eToWide(fromWei(boostBasisPoints, 2)),
          boost_percentage_description: (
            <div className="text-left">
              You are earning{' '}
              {
                <Display
                  className="inline"
                  data={eToWide(fromWei(boostBasisPoints, 2))}
                ></Display>
              }
              % more USDC rewards using&nbsp;
              {
                <Display
                  className="inline"
                  data={eToWide(fromWei(bnBfrInFeeBfr))}
                ></Display>
              }{' '}
              Staked Multiplier Points.
              <br />
              <br />
              Use the "Compound" button to stake your Multiplier Points.
            </div>
          ),
          multiplier_points_apr: 100,
          total_staked: {
            value_in_usd: multiply(fromWei(totalStakedBFR), bfrPrice),
            token_value: fromWei(totalStakedBFR),
            token_value_abs: totalStakedBFR,
          },
          total_supply: {
            value_in_usd: multiply(fromWei(totalBFRSupply), bfrPrice),
            token_value: fromWei(totalBFRSupply),
          },
          user: {
            allowance: fromWei(bfrStakedBfrTrackerAllowance),
            rewards: add(
              fromWei(multiply(stakedBFRTrackerRewards, bfrPrice)),
              fromWei(feeBFRTrackerRewards, usd_decimals)
            ),
            usd_reward: fromWei(feeBFRTrackerRewards, usd_decimals),
            esBfr_rewards: {
              value_in_usd: fromWei(
                multiply(stakedBFRTrackerRewards, bfrPrice)
              ),
              value_abs: fromWei(stakedBFRTrackerRewards),
            },
            staked: {
              value_in_usd: multiply(fromWei(userStakedBFR), bfrPrice),
              token_value: fromWei(userStakedBFR),
              token_value_abs: userStakedBFR,
            },
            wallet_balance: {
              value_in_usd: multiply(fromWei(bfrInWallet), bfrPrice),
              token_value: fromWei(bfrInWallet),
              token_value_abs: bfrInWallet,
            },
          },
        },
        blp: {
          price: blpPrice,
          apr: {
            value: fromWei(blpAprTotal, 2),
            tooltip: [
              { key: 'Escrowed BFR APR', value: fromWei(blpAprForEsBfr, 2) },
              { key: 'USDC APR', value: fromWei(blpAprForRewardToken, 2) },
            ],
            description:
              'APRs are updated weekly on Wednesday and will depend on the fees collected for the week.',
          },
          currentLiquidity: fromWei(blpTotalBalance, usd_decimals),
          maxLiquidity: fromWei(blpMaxLiquidity, usd_decimals),
          lockupPeriod: blpLockupPeriod,
          blpToUsdc: blpPrice,
          usdcToBlp: gt(blpPrice, '0') ? divide('1', blpPrice) : '0',
          max_unstakeable: fromWei(maxBlpToWithdraw, usd_decimals),
          total_staked: {
            value_in_usd: multiply(fromWei(stakedBlp, usd_decimals), blpPrice),
            token_value: fromWei(stakedBlp, usd_decimals),
            token_value_abs: stakedBlp,
          },
          total_supply: {
            value_in_usd: multiply(fromWei(blpSupply, usd_decimals), blpPrice),
            token_value: fromWei(blpSupply, usd_decimals),
          },
          user: {
            rewards: add(
              fromWei(multiply(stakedBlpTrackerRewards, bfrPrice)),
              fromWei(feeBlpTrackerRewards, usd_decimals)
            ),
            usd_reward: fromWei(feeBlpTrackerRewards, usd_decimals),
            esBfr_rewards: {
              value_in_usd: fromWei(
                multiply(stakedBlpTrackerRewards, bfrPrice)
              ),
              value_abs: fromWei(stakedBlpTrackerRewards),
            },
            staked: {
              value_in_usd: multiply(
                fromWei(userStakedBlp, usd_decimals),
                blpPrice
              ),
              token_value: fromWei(userStakedBlp, usd_decimals),
              token_value_abs: userStakedBlp,
            },
            wallet_balance: {
              value_in_usd: multiply(
                fromWei(userStakedBlp, usd_decimals),
                blpPrice
              ),
              token_value: fromWei(userStakedBlp, usd_decimals),
              token_value_abs: userStakedBlp,
            },
            max_unlocked_amount: fromWei(userUnlockedBlpAmount, usd_decimals),
          },
        },
        esBfr: {
          price: bfrPrice,
          max_unstakeable: maxUnstakableEsBfr,
          multiplier_points_apr: 100,
          apr: {
            value: fromWei(bfrAprTotalWithBoost, 2),
            tooltip: gt(bfrBoostAprForRewardToken, '0')
              ? [
                  {
                    key: 'Boosted APR',
                    value: fromWei(bfrBoostAprForRewardToken, 2),
                  },
                  {
                    key: 'Base USDC APR',
                    value: fromWei(bfrAprForRewardToken, 2),
                  },
                  {
                    key: 'Escrowed BFR APR',
                    value: fromWei(bfrAprForEsBfr, 2),
                  },
                ]
              : [
                  {
                    key: 'Escrowed BFR APR',
                    value: fromWei(bfrAprForEsBfr, 2),
                  },
                  {
                    key: 'Base USDC APR',
                    value: fromWei(bfrAprForRewardToken, 2),
                  },
                ],
            description: '',
          },
          total_staked: {
            value_in_usd: multiply(
              fromWei(subtract(stakedBFRTrakerSupply, totalStakedBFR)),
              bfrPrice
            ),
            token_value: fromWei(
              subtract(stakedBFRTrakerSupply, totalStakedBFR)
            ),
            token_value_abs: subtract(stakedBFRTrakerSupply, totalStakedBFR),
          },
          total_supply: {
            value_in_usd: multiply(
              fromWei(
                subtract(
                  esBFRSupply,
                  add(stakedBlpDistributorBalance, stakedBfrDistributorBalance)
                )
              ),
              bfrPrice
            ),
            token_value: fromWei(
              subtract(
                esBFRSupply,
                add(stakedBlpDistributorBalance, stakedBfrDistributorBalance)
              )
            ),
          },
          user: {
            allowance: fromWei(esbfrStakedBfrTrackerAllowance),
            staked: {
              value_in_usd: multiply(fromWei(stakedEsBFR), bfrPrice),
              token_value: fromWei(stakedEsBFR),
              token_value_abs: stakedEsBFR,
            },
            wallet_balance: {
              value_in_usd: multiply(fromWei(esBFRInWallet), bfrPrice),
              token_value: fromWei(esBFRInWallet),
              token_value_abs: esBFRInWallet,
            },
          },
        },
        total_rewards: {
          multiplier_points: fromWei(bonusBfrTrackerRewards),
          staked_multiplier_points: fromWei(stakedMultiplierPoints),
          total: add(
            add(
              fromWei(
                multiply(
                  add(stakedBFRTrackerRewards, stakedBlpTrackerRewards),
                  bfrPrice
                )
              ),
              fromWei(
                add(feeBlpTrackerRewards, feeBFRTrackerRewards),
                usd_decimals
              )
            ),
            fromWei(multiply(add(blpVesterRewards, bfrVesterRewards), bfrPrice))
          ),
          usd: {
            token_value: fromWei(
              add(feeBlpTrackerRewards, feeBFRTrackerRewards),
              usd_decimals
            ),
          },
          esBfr: {
            value_in_usd: multiply(
              fromWei(add(stakedBFRTrackerRewards, stakedBlpTrackerRewards)),
              bfrPrice
            ),
            token_value: fromWei(
              add(stakedBFRTrackerRewards, stakedBlpTrackerRewards)
            ),
          },
          bfr: {
            value_in_usd: multiply(
              fromWei(add(blpVesterRewards, bfrVesterRewards)),
              bfrPrice
            ),
            token_value: fromWei(add(blpVesterRewards, bfrVesterRewards)),
          },
        },
      },
      vest: {
        ibfr: {
          staked_tokens: {
            value: fromWei(add(bnBfrInFeeBfr, bonusBfrInFeeBfr)),
            tooltip: [
              { key: 'BFR', value: fromWei(userStakedBFR) },
              { key: 'esBFR', value: fromWei(stakedEsBFR) },
              { key: 'Multiplier Points', value: fromWei(bnBfrInFeeBfr) },
            ],
          },
          pair_token: bfrVesterPairToken,
          reserved_for_vesting: [
            fromWei(bfrVesterPairAmount),
            fromWei(add(bnBfrInFeeBfr, bonusBfrInFeeBfr)),
          ],
          vesting_status: {
            claimed: fromWei(add(bfrVesterClaimedAmounts, bfrVesterClaimable)),
            vested: fromWei(bfrVesterVestedAmount),
          },
          claimable: fromWei(bfrVesterClaimable),
          maxVestableAmount: fromWei(bfrRemainingVestableAmount),
          averageStakedAmount: fromWei(bfrVesterAverageStakedAmount),
          maxVestableAmountExact: fromWei(bfrMaxVestableAmount),
          allowance: fromWei(esbfrStakedBfrTrackerAllowance),
          hasEnoughReserveTokens: isVestable(
            bfrVesterAverageStakedAmount,
            bfrMaxVestableAmount,
            feeBfrTrackerUserBalance,
            esBFRInWallet,
            bfrVesterPairAmount
          ),
        },
        blp: {
          staked_tokens: {
            value: fromWei(userStakedBlp, usd_decimals),
            tooltip: [],
          },
          pair_token: blpVesterPairToken,
          reserved_for_vesting: [
            fromWei(blpVesterPairAmount, usd_decimals),
            fromWei(userStakedBlp, usd_decimals),
          ],
          vesting_status: {
            claimed: fromWei(add(blpVesterClaimedAmounts, blpVesterClaimable)),
            vested: fromWei(blpVesterVestedAmount),
          },
          claimable: fromWei(blpVesterClaimable),
          maxVestableAmount: fromWei(blpRemainingVestableAmount),
          averageStakedAmount: fromWei(
            blpVesterAverageStakedAmount,
            usd_decimals
          ),
          maxVestableAmountExact: fromWei(blpMaxVestableAmount),
          allowance: fromWei(esbfrStakedBlpTrackerAllowance),
          hasEnoughReserveTokens: isVestable(
            blpVesterAverageStakedAmount,
            blpMaxVestableAmount,
            stakedBlpTrackerUserBalance,
            esBFRInWallet,
            blpVesterPairAmount
          ),
        },
      },
    };
  }


  return bfrPrice && response ? response : { earn: null, vest: null };
};

export function getNewReserve(
  amount,
  averageStakedAmount,
  maxVestableAmount, // maxVestableAmountExact
  reserveAmount, //reserved_for_vesting[0]
  vestedAmount //vesting_status[1]
) {
  let nextDepositAmount = vestedAmount;
  if (amount) {
    nextDepositAmount = add(amount, vestedAmount);
  }
  let nextReserveAmount = reserveAmount;

  let additionalReserveAmount = '0';
  if (
    amount &&
    averageStakedAmount &&
    maxVestableAmount &&
    gt(maxVestableAmount, '0')
  ) {
    nextReserveAmount = divide(
      multiply(averageStakedAmount, nextDepositAmount),
      maxVestableAmount
    );
    if (gt(nextReserveAmount, reserveAmount)) {
      additionalReserveAmount = subtract(nextReserveAmount, reserveAmount);
    }
  }
  return gte(reserveAmount, additionalReserveAmount)
    ? reserveAmount
    : additionalReserveAmount;
}
