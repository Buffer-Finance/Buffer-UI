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
  PoolDropDownAll,
  useActivePoolAll,
  useActivePoolObj,
} from './BinaryOptions/PGDrawer/PoolDropDown';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import ConfigABI from '@Views/BinaryOptions/ABI/configABI.json';
import OptionAbi from '@Views/BinaryOptions/ABI/optionsABI.json';
import PoolAbi from '@Views/BinaryOptions/ABI/poolABI.json';
import { divide } from '@Utils/NumString/stringArithmatics';
import { RenderAdminNavbar } from 'src/Admin/CreatePair';

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
    // console.log(`acc: `, acc);
    return acc;
  },
  {}
);

const notYetHandledConfigs = ['marketTime'];

const configDataAtom = atom<ConfigValue[]>([]);
const poolConfigAtom = atom<ConfigValue[]>([]);
const poolDecimals = [6,6,18]
type ChainInfo = (typeof Config)['421613'];
const TradingConfig: React.FC<any> = ({}) => {
  const { activeChain } = useActiveChain();

  const [configData, setConfigData] = useAtom(configDataAtom);
  const [poolConfig, setPoolConfig] = useAtom(poolConfigAtom);
  const { activePoolObj } = useActivePoolAll();

  const [configReadCalls, configState, decimals]:
    | [null, null, null]
    | [Call[], ConfigValue[] | object] = useMemo(() => {
    let minFee = 6;
    if (activePoolObj.token.name.toLowerCase() == 'arb') {
      minFee = 8;
    }
    let decimalObj = {
      assetUtilizationLimit: 2,
      optionFeePerTxnLimitPercent: 2,
      baseSettlementFeePercentageForAbove: 2,
      baseSettlementFeePercentageForBelow: 2,
      overallPoolUtilizationLimit: 2,
      minFee,
      maxLiquidity: minFee,
    };
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
      if (activePoolConfigAddress && activePoolOptionAddress) {
        // config contract values
        for (let config in initialConfigValues) {
          if (
            !notYetHandledConfigs.includes(initialConfigValues[config].getter)
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
    return [calls, configValues, decimalObj];
  }, [activeChain, activePoolObj?.token?.name]);
  const [poolConfigReadCalls, poolConfigState]:
    | [null, null]
    | [Call[], ConfigValue[]] = useMemo(() => {
    if (!activeChain?.id) return [null, null];
    let calls: Call[] = [];
    const configValues: ConfigValue[] = [];
    const activeChainData = Config[activeChain.id.toString()] as ChainInfo;
    for (const token in activeChainData.tokens) {
      calls.push({
        address: activeChainData.tokens[token].pool_address,
        abi: PoolAbi,
        name: 'maxLiquidity',
        params: [],
      });
      configValues.push({
        getter: 'maxLiquidity',
        setter: 'setMaxLiquidity',
        index: 'maxLiquidity',
        contract: '',
        value: null,
        selected: false,
        newValue: null,
        abi: PoolAbi,
        market: {
          pair: token,
          contract: activeChainData.tokens[token].pool_address!,
        },
      });
    }
    console.log(`cddalls: `, calls);
    return [calls, configValues];
  }, [activeChain, activePoolObj?.token?.name]);
  console.log(`configReadCalls: `, configReadCalls);
  useEffect(() => {
    setConfigData(configState);
  }, [configState]);
  useEffect(() => {
    setPoolConfig(poolConfigState);
  }, [poolConfigState]);
  const [search, setSearch] = useState('');
  const response = useReadCall({
    contracts: configReadCalls!,
    swrKey: 'swr-key' + activePoolObj.token.name,
  }).data;
  const poolResponse = useReadCall({
    contracts: poolConfigReadCalls!,
    swrKey: 'swr-key-pools' + activePoolObj.token.name,
  }).data;
  const { writeCall } = useIndependentWriteCall();

  if (!configState || !response) return <div>Loading....</div>;
  return (
    <div className="mx-[30px] mt-[20px]">
      <RenderAdminNavbar />

      <div className="text-f12 text-2 mt-4">
        Tip: You can filter settings via entering market-name or setting-name in
        search box.
      </div>
      <div className="text-f14 text-1 mt-4">
        Click on "Edit" -> Press "Change" 
      </div>
      <div className="flex items-center text-f14 mt-4">
        Select Pool :&nbsp;&nbsp;&nbsp;
        <PoolDropDownAll />
      </div>
      <div className="flex items-center text-f14 mt-4">
        <div>Search :&nbsp;&nbsp;&nbsp; </div>
        <BufferInput value={search} onChange={(val) => setSearch(val)} />
      </div>
      <div className="text-f14 mt-3">Option Configs</div>
      <TableAligner
        keyStyle={keyClasses}
        valueStyle={valueClasses}
        getClassName={(key, idx) => {
          let retClass = '';
          if (search) {
            console.log(`key.includes(search): `, key.includes(search));
            if (!key.includes(search)) {
              retClass = '!hidden';
            }
            console.log(`retClass: `, retClass);
          }
          return retClass;
        }}
        keysName={configData.map(
          (c, id) =>
            c.market.pair +
            ' : ' +
            c.getter +
            (decimals[c.getter] ? ' (' + decimals[c.getter] + ' dec)' : '')
        )}
        values={response.map((v, id) => (
          <ValueEditor
            value={v[0]}
            decimals={decimals}
            id={id}
            {...{ writeCall, configData, setConfigData }}
          />
        ))}
      ></TableAligner>
      <div className="text-f14 mt-3">Pools Config</div>
      <TableAligner
        keyStyle={keyClasses}
        valueStyle={valueClasses}
        keysName={poolConfig.map(
          (c, id) =>
            c.market.pair +
            ' : ' +
            c.getter +
            (' (' + poolDecimals[id]+ ' dec)' )
        )}
        values={poolResponse.map((v, id) => (
          <ValueEditor
            value={v[0]}
            id={id}
            {...{
              writeCall,
              configData: poolConfig,
              setConfigData: setPoolConfig,
            }}
            decimals={decimals}
          />
        ))}
      ></TableAligner>{' '}
    </div>
  );
};

export { TradingConfig };

const ValueEditor: React.FC<{
  value: string | number;
  id: number;
  writeCall: any;
  configData: any;
  setConfigData: any;
  decimals: any;
}> = ({ value, writeCall, id, configData, setConfigData, decimals }) => {
  console.log(`decimal: `, decimals);
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
        {isBoolean
          ? JSON.stringify(value)
          : (() => {
              if (!Number.isNaN(+value)) {
                if (decimals?.[configData[id]?.getter]) {
                  if(configData[id].getter == 'maxLiquidity' && configData[id].market.pair.includes('ARB')){
                    return divide(value, 18);

                  }
                  return divide(value, decimals[configData[id].getter]);
                }
              }
              return value;
            })()}
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
              '_baseSettlementFeePercentageForAbove (2 dec)',
              '_baseSettlementFeePercentageForBelow (2 dec)',
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
