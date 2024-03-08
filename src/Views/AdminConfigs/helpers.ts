import ConfigAbi from '@ABIs/ABI/configABI.json';
import { marketTypeAB } from '@Views/AboveBelow/types';
import rawConfigs from '@Views/AdminConfigs/AdminConfigs.json';
import OptionAbi from '@Views/TradePage/ABIs/OptionContract.json';
import RouterAbi from '@Views/TradePage/ABIs/RouterABI.json';
import { poolType } from '@Views/TradePage/type';
import { ethers } from 'ethers';
import { Chain } from 'wagmi';

export const group2abi = {
  router: RouterAbi,
  options: OptionAbi,
  options_config: ConfigAbi,
  // marketoi: MarketOiAbi,
  // booster: BoosterAbi,
  // pooloi: PoolOiAbi,
  // pool: PoolAbi,
  // config_setter: ConfigSetterABI,
};

const group2marketAddresesMapping = {
  // marketoi: 'marketOiContract',
  options_config: 'configContract',
  options: 'optionContract',
  // pooloi: 'poolOIContract',
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
  market?: marketTypeAB;
  type?: string;
};

type AdminConfig = {
  [value in keyof typeof group2abi]: Config;
};

export function generateTransactionData(
  contractAddress: string,
  contractABI: any[],
  functionName: string,
  functionParameters: any[]
) {
  const providerUrl =
    'https://eth-goerli.g.alchemy.com/v2/Dn8U2J-wzWwQM3EqLryCVFloK9H8OY5q';
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  return contract.interface.encodeFunctionData(
    functionName,
    functionParameters
  );
}

export const raw2adminConfig = (
  marketConfig: marketTypeAB[] | null,
  activeChain: Chain
): AdminConfig | null => {
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
      console.log(setterSignature, 'setterSignature');
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
          console.log('market', market, config, configs, group);
          let decimal = configs[config].decimal;
          if (decimal && decimal == 'token') {
            decimal = market.poolInfo.decimals;
          }

          const currObject: Config = {
            ...configs[config],
            decimal,
            contract:
              group === 'options_config'
                ? market.config.address
                : market.address,
            group,
            getter,
            setter,
            pool: market.poolInfo,

            market,
          };
          if (configObject?.[group]) {
            configObject[group].push(currObject);
          } else {
            configObject[group] = [currObject];
          }
        }
      }
    }
  }

  console.log('configObject', configObject);
  return configObject;
};
