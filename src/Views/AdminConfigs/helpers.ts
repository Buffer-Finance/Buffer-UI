import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import OptionAbi from '@Views/TradePage/ABIs/OptionContract.json';
import ConfigAbi from '@ABIs/ABI/configABI.json';
import PoolAbi from '@ABIs/ABI/poolABI.json';
import PoolOiAbi from '@ABIs/PoolOiAbi.json';
import BoosterAbi from '@ABIs/BoosterAbi.json';
import MarketOiAbi from '@ABIs/MarketOiAbi.json';
import rawConfigs from '@Views/AdminConfigs/AdminConfigs.json';
import RouterAbi from '@Views/TradePage/ABIs/RouterABI.json';
import { Abi } from 'viem';
import { appConfig } from '@Views/TradePage/config';
import { marketType, poolType } from '@Views/TradePage/type';
import { Chain } from 'wagmi';
export const group2abi = {
  router: RouterAbi,
  options: OptionAbi,
  options_config: ConfigAbi,
  marketoi: MarketOiAbi,
  booster: BoosterAbi,
  pooloi: PoolOiAbi,
  pool: PoolAbi,
};

const group2marketAddresesMapping = {
  marketoi: 'marketOiContract',
  options_config: 'configContract',
  options: 'optionContract',
  pooloi: 'poolOIContract',
};

const marketDependent = Object.keys(group2marketAddresesMapping);

type ipop = 'string' | 'number' | 'bool';
type formaters = { name: string; type: ipop; value: string }[];
type RPCPayloads = {
  name: string;
  op: formaters;
  ip: formaters;
};

export type Config = {
  getter: RPCPayloads;
  setter: RPCPayloads;
  group: keyof typeof group2abi;
  contract: `0x${string}`;
  mapper: () => void;
  hint?: string;
  decimal?: number;
  pool?: poolType;
  market?: marketType;
};

type AdminConfig = {
  [value in keyof typeof group2abi]: Config;
};

// type Groups = keyof typeof group2abi;

type RawConfig = {
  getter: string;
  decimal?: number;
};

export const raw2adminConfig = (
  marketConfig: marketType[] | null,
  activeChain: Chain
): AdminConfig | null => {
  const appDefaults =
    appConfig[(activeChain.id + '') as keyof typeof appConfig];
  let configObject = {};
  if (!marketConfig?.length) return null;

  for (const [group, configs] of Object.entries(rawConfigs)) {
    for (const config in configs) {
      const getterSignatre = group2abi[group].find(
        (a) =>
          configs[config as keyof typeof configs].getter &&
          a.name == configs[config as keyof typeof configs].getter &&
          a.inputs.length == 0
      );

      const getter = getterSignatre
        ? {
            name: getterSignatre.name,
            ip: getterSignatre.inputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
            op: getterSignatre.outputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
          }
        : null;
      const setterSignature = group2abi[group].find((a) => a.name == config);

      const setter = setterSignature
        ? {
            name: setterSignature.name,
            ip: setterSignature.inputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
            op: setterSignature.outputs.map((ip) => ({
              name: ip.name,
              type: ip.type,
              value: '',
            })),
          }
        : null;
      if (marketDependent.includes(group as keyof typeof rawConfigs)) {
        for (let market of marketConfig) {
          for (const pool of market.pools) {
            let decimal = configs[config].decimal;
            if (decimal && decimal == 'token') {
              decimal = appDefaults.poolsInfo[pool.pool].decimals;
            }

            const currObject: Config = {
              ...configs[config],
              decimal,
              contract: pool[group2marketAddresesMapping[group]],
              group,
              getter,
              setter,
              pool: appDefaults.poolsInfo[pool.pool],

              market,
            };
            if (configObject?.[group]) {
              configObject[group].push(currObject);
            } else {
              configObject[group] = [currObject];
            }
          }
        }
      } else if (group == 'pool') {
        // here

        const pools = Object.keys(appDefaults.poolsInfo);
        configObject[group] = pools.map((p) => {
          let decimal = configs[config].decimal;
          if (decimal && decimal == 'token') {
            decimal = appDefaults.poolsInfo[p].decimals;
          }
          return {
            ...configs[config],
            decimal,
            contract: p,
            getter,
            setter,
            group,
            pool: appDefaults.poolsInfo[p],
          };
        });

        // configObject[group] = {
      } else {
        let currConfigObject = {
          ...configs[config],

          contract: appDefaults[group],
          getter,
          setter,
          group,
        };
        if (group in configObject) {
          configObject[group].push(currConfigObject);
        } else configObject[group] = [currConfigObject];
      }
    }
  }

  return configObject;
};
