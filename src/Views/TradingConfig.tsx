import { ContractInterface, ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import Config from 'public/config.json';
import ConfigContract from './ConfigContractAbi.json';
import { useWriteCall } from '@Hooks/useWriteCall';
import { Call } from '@Utils/Contract/multiContract';
import { useDashboardTableData } from './Dashboard/Hooks/useDashboardTableData';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Markets } from 'src/Types/Market';
const ifc = new ethers.utils.Interface(ConfigContract);
import TestAvatarAbi from '@Views/ConfigContractAbi.json';
import { useReadCall } from '@Utils/useReadCall';
import { TableAligner } from './V2-Leaderboard/Components/TableAligner';
import { keyClasses } from './Earn/Components/VestCards';
import { valueClasses } from './Earn/Components/VestCards';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import BufferInput from './Common/BufferInput';
import { ModalBase } from 'src/Modals/BaseModal';
import { BlueBtn } from './Common/V2-Button';
import {
  PoolDropDown,
  useActivePoolObj,
} from './BinaryOptions/PGDrawer/PoolDropDown';
import { Button } from '@mui/material';
import {
  encodeMulti,
  MetaTransaction,
  TransactionType,
} from 'ethers-multisend';
import { IMarket } from './BinaryOptions';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import ConfigABI from '@Views/BinaryOptions/ABI/configABI.json';
import OptionAbi from '@Views/BinaryOptions/ABI/optionsABI.json';

interface ConfigValue {
  getter: string;
  setter: string;
  index: string;
  contract: string;
  value: null;
  selected: boolean;
  newValue: null;
  market: { pair: string; contract: string };
  abi: any[];
}

const initialConfigValues = Object.keys(ifc.functions).reduce(
  (acc: { [key: string]: ConfigValue }, item) => {
    const rawFunctionName = ifc.functions[item].name;
    if (
      item.length > 3 &&
      item.substring(0, 3).includes('set') &&
      item[3].toUpperCase().includes(item[3])
    ) {
      const getter =
        rawFunctionName.substring(3, 4).toLowerCase() +
        rawFunctionName.substring(4);

      acc[item] = {
        getter,
        setter: rawFunctionName,
        index: item,
        contract: '',
        value: null,
        selected: false,
        newValue: null,
      };
    }
    console.log(`acc: `, acc);
    return acc;
  },
  {}
);

const getMarketConfigs = (contract: string, abi: any[]) => {
  Object.keys(ifc.functions).reduce(
    (acc: { [key: string]: ConfigValue }, item) => {
      const rawFunctionName = ifc.functions[item].name;
      if (item.length > 3 && item.substring(0, 3).includes('set')) {
        const getter =
          rawFunctionName.substring(3, 4).toLowerCase() +
          rawFunctionName.substring(4);
        acc[item] = {
          getter,
          contract,
          abi,
          setter: rawFunctionName,
          index: item,
          value: null,
          selected: false,
          newValue: null,
        };
      }
      return acc;
    },
    {}
  );
};
// function getCallsFromConfigValues (configValues:ConfigValue[]):Call{

//   return configValues.map(configValue=>({
//     address:
//   }))

// }
const notYetHandledConfigs = ['marketTime'];

const configDataAtom = atom<ConfigValue[]>([]);

type ChainInfo = (typeof Config)['421613'];
// all markets, all config values.
const TradingConfig: React.FC<any> = ({}) => {
  const { activeChain } = useActiveChain();

  const setConfigData = useSetAtom(configDataAtom);
  const { activePoolObj } = useActivePoolObj();

  console.log(`activePoolObj.token: `, activePoolObj.token);
  const [configReadCalls, configState]: [null, null] | [Call[], ConfigValue[]] =
    useMemo(() => {
      if (!activeChain?.id) return [null, null];
      let calls: Call[] = [];
      const configValues: ConfigValue[] = [];
      const activeChainData = Config[activeChain.id.toString()] as ChainInfo;
      activeChainData.pairs.forEach((d) => {
        const activePoolConfigAddress = d.pools.find(
          (pool) => pool.token == activePoolObj.token.name
        )?.options_contracts.config;
        const activePoolOptionAddress = d.pools.find(
          (pool) => pool.token == activePoolObj.token.name
        )?.options_contracts.current;
        {
          if (activePoolConfigAddress && activePoolOptionAddress)
            // config contract values
            for (let config in initialConfigValues) {
              console.log(`config: `, config);
              if (
                !notYetHandledConfigs.includes(
                  initialConfigValues[config].getter
                )
              ) {
                calls.push({
                  address: activePoolConfigAddress,
                  abi: ConfigContract,
                  name: initialConfigValues[config].getter,
                  params: [],
                });
                configValues.push({
                  ...initialConfigValues[config],
                  ...{
                    market: {
                      pair: d.pair,
                      contract: activePoolConfigAddress,
                    },
                  },
                });
              }
            }
          // option contract values
          calls.push({
            address: activePoolOptionAddress!,
            abi: OptionAbi,
            name: 'baseSettlementFeePercentageForAbove',
            params: [],
          });
          calls.push({
            address: activePoolOptionAddress!,
            abi: OptionAbi,
            name: 'baseSettlementFeePercentageForBelow',
            params: [],
          });
          calls.push({
            address: activePoolOptionAddress!,
            abi: OptionAbi,
            name: 'isPaused',
            params: [],
          });
          configValues.push({
            getter: 'baseSettlementFeePercentageForAbove',
            setter: 'configure',
            index: 'configure',
            contract: '',
            value: null,
            selected: false,
            newValue: null,
            abi: OptionAbi,
            market: {
              pair: d.pair,
              contract: activePoolOptionAddress!,
            },
          });
          configValues.push({
            getter: 'baseSettlementFeePercentageForBelow',
            setter: 'configure',
            index: 'configure',
            contract: '',
            value: null,
            selected: false,
            newValue: null,
            abi: OptionAbi,
            market: {
              pair: d.pair,
              contract: activePoolOptionAddress!,
            },
          });
          configValues.push({
            getter: 'isPaused',
            setter: 'toggleCreation',
            index: 'toggleCreation',
            contract: '',
            value: null,
            selected: false,
            newValue: null,
            abi: OptionAbi,
            market: {
              pair: d.pair,
              contract: activePoolOptionAddress!,
            },
          });
        }
      });
      return [calls, configValues];
    }, [activeChain, activePoolObj?.token?.name]);
  console.log(`configReadCalls: `, configReadCalls);
  useEffect(() => {
    setConfigData(configState);
  }, [configState]);

  const response = useReadCall({
    contracts: configReadCalls,
    swrKey: 'swr-key',
  }).data;

  if (!configState || !response) return <div>Loading....</div>;
  return (
    <div className="mx-[30px]">
      <ConfigValueManager values={response} />
    </div>
  );
};

export { TradingConfig };

const ConfigValueManager: React.FC<{
  values: any[][];
}> = ({ values }) => {
  const { writeCall } = useIndependentWriteCall();
  const [changeData, setChangeData] = useState([]);
  const [configData, setConfigData] = useAtom(configDataAtom);

  return (
    <>
      <div className="">
        <PoolDropDown />
      </div>
      <div className="text-f14 mt-3">Option Configs</div>
      <TableAligner
        keyStyle={keyClasses}
        valueStyle={valueClasses}
        keysName={configData.map((c, id) => c.market.pair + ' : ' + c.getter)}
        values={values.map((v, id) => (
          <ValueEditor value={v[0]} id={id} writeCall={writeCall} />
        ))}
      ></TableAligner>
    </>
  );
};

const ValueEditor: React.FC<{
  value: string | number;
  id: number;
  writeCall: any;
}> = ({ value, writeCall, id }) => {
  const { activePoolObj } = useActivePoolObj();
  const [configData, setConfigData] = useAtom(configDataAtom);
  const isChanged = configData[id].newValue && value != configData[id].newValue;
  const isBoolean = typeof value == 'boolean';
  const isConfigure = configData[id].setter == 'configure';
  const [configure, setConfigure] = useState(['', '', '']);

  const wc = () => {
    const activePool = configData[id].market?.contract;
    console.log(`configure: `, configure);
    let args = configure;
    args[2] = configure[2].split(' ');
    writeCall(
      activePool,
      configData[id].abi || ConfigABI,
      () => {},
      configData[id].setter,
      isBoolean ? [] : isConfigure ? configure : [configData[id].newValue]
    );
  };
  console.log(`configData[id].setter: `, configData[id].setter);
  return (
    <div className="flex gap-x-[10px] items-center">
      <span
        className={
          isChanged && 'line-through decoration-[red] decoration-[2px]'
        }
      >
        {isBoolean ? JSON.stringify(value) : value}
      </span>
      <button
        onClick={() => {
          if (isBoolean) {
            return wc();
          }
          setConfigData((s) => {
            const updatedS = [...s];
            updatedS[id].selected = !updatedS[id].selected;
            updatedS[id].newValue = value;
            return updatedS;
          });
        }}
      >
        {isBoolean ? 'Toggle' : ' Edit'}
      </button>
      {configData[id].selected &&
        (isConfigure ? (
          <div className="">
            {[
              '_baseSettlementFeePercentageForAbove',
              '_baseSettlementFeePercentageForBelow',
              '_nftTierStep (4 space separted digits)',
            ].map((s, idx) => (
              <div className="text-f14 text-1">
                <div className="">{s.replace('_', '')}</div>
                <BufferInput
                  value={configure[idx]}
                  className="!w-full"
                  onChange={(val) => {
                    setConfigure((s) => {
                      let up = [...s];
                      up[idx] = val;
                      return up;
                    });
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <BufferInput
            value={configData[id].newValue}
            className="!w-full"
            onChange={(val) => {
              setConfigData((s) => {
                const updatedS = [...s];
                updatedS[id].newValue = val;
                return updatedS;
              });
            }}
          />
        ))}
      {((isConfigure && configData[id].selected) || isChanged) && (
        <BlueBtn className="!w-[80px] !px-[10px] " onClick={wc}>
          Change
        </BlueBtn>
      )}
    </div>
  );
};
