import bfrAbi from '../Config/Abis/BFR.json';
import VesterAbi from '../Config/Abis/Vester.json';
import RewardTrackerAbi from '../Config/Abis/RewardTracker.json';
import BlpAbi from '../Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import TokenAbi from '../Config/Abis/Token.json';
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
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { roundToTwo } from '@Utils/roundOff';
import { appConfig } from '@Views/TradePage/config';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import getDeepCopy from '@Utils/getDeepCopy';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';

export const TOTALSUPPLY = 80 * 10 ** 6 * 10 ** 18;

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
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetTokenomics = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useActiveChain();
  const contracts =
    appConfig[activeChain.id as unknown as keyof typeof appConfig].EarnConfig;
  const allDecimals = useDecimalsByAsset();
  const bfrPrice = useIbfrPrice();
  const usd_decimals = allDecimals['USDC'];

  const getUserSpecificCalls = () => {
    if (!activeChain || !contracts) return [];
    const user_specific_data = {
      feeBlpTrackerRewards: {
        address: contracts.FeeBlpTracker,
        abi: RewardTrackerAbi,
        functionName: 'claimable',
        args: [account],
      },

      stakedBlpTrackerRewards: {
        address: contracts.StakedBlpTracker,
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
      userUsdcBalance: {
        address: contracts.USDC,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [account],
      },

      userUnlockedBlpAmount: {
        address: contracts.BLP,
        abi: BlpAbi,
        functionName: 'getUnlockedLiquidity',
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
    };
    return Object.keys(user_specific_data).map(function (key) {
      return user_specific_data[key];
    });
  };
  const getcalls = () => {
    const userSpecificCalls = getUserSpecificCalls();
    if (!activeChain || !contracts) return [];
    const generic_call_data = {
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
      blpUSDCAmount: {
        address: contracts.USDC,
        abi: bfrAbi,
        functionName: 'balanceOf',
        args: [contracts.BLP],
      },
    };
    return Object.keys(generic_call_data)
      .map(function (key) {
        return generic_call_data[key];
      })
      .concat(account ? userSpecificCalls : []);
  };

  const calls = getcalls().map((call) => {
    return { ...call, chainId: activeChain.id };
  });
  console.log('useGetTokenomics-calls: ', calls);
  let { data: da } = useContractReads({
    contracts: calls,
    select: (d) => d.map((signle) => signle.result?.toString() || '0'),
    watch: true,
  });
  let data = getDeepCopy(da);
  convertBNtoString(data);

  let response = {};
  if (data && data[0] && bfrPrice && gt(bfrPrice, '0')) {
    let [
      stakedBlp,
      blpSupply,
      feeBlpTrackerTokensPerInterval,
      stakedBlpTrackerTokensPerInterval,
      blpTotalBalance,
      maxTokenXToWithdraw,
      blpInitialRate,
      blpLockupPeriod,
      blpMaxLiquidity,
      blpUSDCAmount,

      // User specifics
      feeBlpTrackerRewards,
      stakedBlpTrackerRewards,
      userStakedBlp,
      blpVesterPairAmount,
      userUsdcBalance,
      userUnlockedBlpAmount,
      blpUsdcAllowance,
    ] = account
      ? data.flat()
      : data.concat(new Array(getUserSpecificCalls().length).fill('0')).flat();

    console.log(
      `useTokenomicsMulticall-convertDataToRes(
          data.concat(new Array(getUserSpecificCalls().length).fill('0')).flat()
        ): `,
      data.concat(new Array(getUserSpecificCalls().length).fill('0'))
    );
    const blpPrice =
      blpSupply > 0
        ? divide(blpTotalBalance, blpSupply)
        : divide('1', blpInitialRate);

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
            value_in_usd: fromWei(blpUSDCAmount, usd_decimals),
            token_value: divide(fromWei(blpUSDCAmount, usd_decimals), blpPrice),
          },
          user: {
            rewards: {
              value: add(
                fromWei(multiply(stakedBlpTrackerRewards, bfrPrice)),
                fromWei(feeBlpTrackerRewards, usd_decimals)
              ),
              tooltip: [
                {
                  key: 'USDC',
                  value: [fromWei(feeBlpTrackerRewards, usd_decimals)],
                },
                {
                  key: 'Escrowed BFR',
                  value: [
                    fromWei(stakedBlpTrackerRewards),
                    fromWei(multiply(stakedBlpTrackerRewards, bfrPrice)),
                  ],
                },
              ],
            },
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

        total_rewards: {
          total: fromWei(feeBlpTrackerRewards, usd_decimals),
          usd: {
            token_value: fromWei(feeBlpTrackerRewards, usd_decimals),
          },
        },
      },
    };
  }

  return bfrPrice && response ? response : { earn: null, vest: null };
};
