import { useActiveChain } from '@Hooks/useActiveChain';
import { response } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getAddress } from 'viem';

export const useMarketsRequest = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  console.log('is-deb', bothVersionMrkets)
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts.filter(
        (optionContract) => {
          console.log('match-deb', optionContract, configData)
          return optionContract.poolContract !== null &&
            getAddress(configData.router) ===
            getAddress(optionContract.routerContract) &&
            optionContract.configContract !== null
        }
      ),
    },
    error,
    mutate,
  };
};

export const useAllV2_5MarketsRequest = () => {
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts.filter(
        (optionContract) =>
          optionContract.poolContract !== null &&
          optionContract.configContract !== null
      ),
    },
    error,
    mutate,
  };
};

export const useV2Markets = () => {
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts,
    },
    error,
    mutate,
  };
};

//fetches all markets from graphql
export const useBothVersionsMarkets = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  console.log('router', configData)
  async function fetcher(): Promise<response> {
    const response = await axios.post(indexer_url, {
      query: `{ 
        optionContracts(limit:1000,where:{routerContract:"${configData.router}"}){
          items{
            configContract {
              address
              maxFee
              maxPeriod
              minFee
              minPeriod
              platformFee
              earlyCloseThreshold
              isEarlyCloseEnabled
              IV
              IVFactorOTM
              IVFactorITM
              creationWindowAddress
            }
            routerContract
            address
            poolContract
            isPaused
            category
            asset
            isRegistered
            pool
          }
                }
            }`,
    });
    console.log('root-deb', response.data?.data)
    return response.data?.data as response;
  }

  const { data, error, mutate } = useSWR<response, Error>(
    `v3AppConfig-activeChain-${activeChain.id}`,
    {
      fetcher: fetcher,
      refreshInterval: 60000,
    }
  );

  const response = useMemo(() => {
    if (!data) return { data, error, mutate };

    return {
      mutate,
      error,
      data: {
        optionContracts: data.optionContracts.items.filter((option) => {
          if (option.poolContract === null) return true;
          const check = (
            configData.poolsInfo[
            getAddress(
              option.poolContract
            ) as keyof typeof configData.poolsInfo
            ] !== undefined
          );
          console.log('check', configData.poolsInfo, option)
          return check;
        }),
      },
    };
  }, [data, error]);

  return response;
};



/*!SECTION

{
    "graph": {
        "ABOVE_BELOW": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.8-ab-usdc-pool/api",
        "MAIN": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.9-ud-usdc-pool/api",
        "EVENTS": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/events/version/v2.5-up-events-mainnet/api",
        "REWARDS": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/mainnet-dummy/version/v0.0.7-rewards-page/api",
        "LEADERBOARD": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/mainnet-dummy/version/v0.0.11-leaderboard-price-fix/api",
        "DASHBOARD": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.6.0-sync-v2.6-history/api",
        "PROFILE": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-mainnet/version/v2.7.2-v2.6-profile-data-2/api",
        "LP": "https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/mainnet-dummy/version/v0.0.6-lp-price-fix/api"
    },
    "product_id": {
        "UP_DOWN": {
            "id": 2,
            "environment": "42161121",
            "metaData": {},
            "name": "UP_DOWN",
            "product_id": "abc",
            "router": "0xf4cc4978C5d80945364fBdBD3750429505ADeB89"
        },
        "AB": {
            "id": 1,
            "environment": "42161121",
            "metaData": {},
            "name": "AB",
            "product_id": "xyz",
            "router": "0x94582981c3be6092b912265C2d2cE172e7f9c3B1"
        }
    },
    "multicall": "0xca11bde05977b3631167028862be2a173976ca11",
    "referral_storage": "0xFea57B9548cd72D8705e4BB0fa83AA35966D9c29",
    "router": "0xf4cc4978C5d80945364fBdBD3750429505ADeB89",
    "signer_manager": "0xdc43CeA44593F9054BB52b7161981918ABdE067a",
    "booster": "0x1FE0A88372A75926dc26dFF369B0b3aC5569F669",
    "config_setter": "0xf5FE716462112a3352926F63d92b51293ac5d006",
    "v2_router": "0xf4cc4978C5d80945364fBdBD3750429505ADeB89",
    "jackpot": "0xe34cd1D40733B991fea9ea8545Fa1F490200d6e8",
    "above_below_router": "0x94582981c3be6092b912265C2d2cE172e7f9c3B1",
    "poolsInfo": {
        "0x6Ec7B10bF7331794adAaf235cb47a2A292cD9c7e": {
            "tokenAddress": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            "faucet": "0x0000000000000000000000000000000000000000",
            "decimals": 6,
            "token": "USDC.e",
            "permitName": "USD Coin (Arb1)",
            "is_pol": false
        },
        "0xfD9f8841C471Fcc55f5c09B8ad868BdC9eDeBDE1": {
            "tokenAddress": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            "faucet": null,
            "decimals": 6,
            "token": "USDC",
            "is_pol": true
        },
        "0x9501a00d7d4BC7558196B2e4d61c0ec5D16dEfb2": {
            "tokenAddress": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            "faucet": null,
            "decimals": 6,
            "token": "USDC",
            "permitName": "USD Coin",
            "is_pol": false
        },
        "0x70086DFD2b089359A6582A18D24aBE1AcE40f8D0": {
            "tokenAddress": "0x9132016099CEbb740db64A36da0D3307824Ad159",
            "faucet": "0x62Db9CD484b3B59e1d0444cea1f0D0D3c00bf2F5",
            "decimals": 18,
            "token": "BFR",
            "permitName": "Token",
            "is_pol": false
        },
        "0xaE0628C88EC6C418B3F5C005f804E905f8123833": {
            "tokenAddress": "0x912CE59144191C1204E64559FE8253a0e49E6548",
            "faucet": "0x6B655D99962F58B9Aa0fFB18281408CdBCf61800",
            "decimals": 18,
            "token": "ARB",
            "permitName": "Arbitrum",
            "is_pol": false
        }
    },
    "EarnConfig": {
        "RewardRouter": "0xbD5FBB3b2610d34434E316e1BABb9c3751567B67",
        "BLP": "0x6Ec7B10bF7331794adAaf235cb47a2A292cD9c7e",
        "iBFR": "0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D",
        "ES_BFR": "0x92914A456EbE5DB6A69905f029d6160CF51d3E6a",
        "BN_BFR": "0xD978595622184c6c64BF0ab7127f3728ca4F1E4a",
        "USDC": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        "StakedBfrTracker": "0x173817F33f1C09bCb0df436c2f327B9504d6e067",
        "BonusBfrTracker": "0x00B88B6254B51C7b238c4675E6b601a696CC1aC8",
        "FeeBfrTracker": "0xBABF696008DDAde1e17D302b972376B8A7357698",
        "StakedBlpTracker": "0x7d1d610Fe82482412842e8110afF1cB72FA66bc8",
        "FeeBlpTracker": "0xCCFd47cCabbF058Fb5566CC31b552b21279bd89a",
        "BfrVester": "0x92f424a2A65efd48ea57b10D345f4B3f2460F8c8",
        "BlpVester": "0x22499C54cD0F38fE75B2805619Ac8d0e815e3DC7",
        "StakedBfrDistributor": "0x0f9a5Db56d0f895d1d18F0aD89002a14271F7162",
        "StakedBlpDistributor": "0xF3Af375AfCdcEA75F70ECfD6D477Ab1a76A33A01",
        "RewardRouter2": "0xFb14188402B2dfd50DA78FFC08Acd72110A81b1c",
        "BLP2": "0xaE0628C88EC6C418B3F5C005f804E905f8123833",
        "StakedBlpTracker2": "0xAC5740D18310ec3bd1f35D9040104C359550c19d",
        "FeeBlpTracker2": "0x49aC47Df2C43Ed5970667c40779126f6a6a61fC2",
        "BlpVester2": "0x405E91Ca914bf3fCC5d45c761dB1E8b034281A18",
        "StakedBlpDistributor2": "0xc8bfba986834B6E5c7Ab58BD2A78c196914Aa6E0",
        "ARB": "0x912CE59144191C1204E64559FE8253a0e49E6548",
        "burnAddress": "0x000000000000000000000000000000000000dEaD"
    },
    "DashboardConfig": {
        "uniswap": "0xB529f885260321729D9fF1C69804c5Bf9B3a95A5",
        "xcal": "0xAaAc379C2Fc98F59bdf26BD4604d4F084310b23D",
        "camelot": "0x47ECF602a62BaF7d4e6b30FE3E8dD45BB8cfFadc",
        "usdcLiquidityAddress": "0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D",
        "bfrLiquidityAddress": "0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D",
        "JLPPoolAddress": "0x97dcc5574B76b91008b684C58DfdF95fE39FA772",
        "LBTPoolAddress": "0x3A3DA6464bEe25a1d98526402a12241B0787b84C"
    }
}


*/