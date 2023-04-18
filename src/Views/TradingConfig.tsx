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
console.log(`ifc: `, ifc.functions);
import { useReadCall } from '@Utils/useReadCall';
import { TableAligner } from './V2-Leaderboard/Components/TableAligner';
import { keyClasses } from './Earn/Components/VestCards';
import { valueClasses } from './Earn/Components/VestCards';
import { atom, useAtom, useAtomValue } from 'jotai';
import BufferInput from './Common/BufferInput';
import { ModalBase } from 'src/Modals/BaseModal';
import { BlueBtn } from './Common/V2-Button';
import {
  PoolDropDown,
  useActivePoolObj,
} from './BinaryOptions/PGDrawer/PoolDropDown';

interface ConfigValue {
  getter: string;
  setter: string;
  index: string;
  contract: string;
  value: null;
  selected: boolean;
  newValue: null;
  market?: string;
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
  const [configValues] = useState(initialConfigValues);
  const { activeChain } = useActiveChain();
  const { writeCall } = useWriteCall(
    '0xc6C370741eCa565D2f10F0Aeee34E6398A7DBA4d',
    ConfigContract
  );
  const [configData, setConfigData] = useAtom(configDataAtom);
  const [activePool, setActivePool] = useState('USDC');
  const { activePoolObj } = useActivePoolObj();

  console.log(`activePoolObj.token: `, activePoolObj.token);
  const [configReadCalls, configState]: [null, null] | [Call[], ConfigValue[]] =
    useMemo(() => {
      if (!activeChain?.id) return [null, null];
      let calls: Call[] = [];
      const configValues: ConfigValue[] = [];
      const activeChainData = Config[activeChain.id.toString()] as ChainInfo;
      activeChainData.pairs.forEach((d) => {
        const activePoolAddress = d.pools.find(
          (pool) => pool.token == activePoolObj.token.name
        )?.options_contracts.config;
        if (activePoolAddress)
          for (let config in initialConfigValues) {
            console.log(`config: `, config);
            if (
              !notYetHandledConfigs.includes(initialConfigValues[config].getter)
            ) {
              calls.push({
                address: activePoolAddress,
                abi: ConfigContract,
                name: initialConfigValues[config].getter,
                params: [],
              });
              configValues.push({
                ...initialConfigValues[config],
                ...{ market: d.pair },
              });
            }
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

  const ones = () => {
    const method = configValues[Object.keys(configValues)[0]].setter;
    const args = [2];
    writeCall(
      () => {
        console.log('success');
      },
      method,
      args,
      null
    );
  };
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
  const [changeData, setChangeData] = useState([]);
  const [configData, setConfigData] = useAtom(configDataAtom);
  const changeChanged = () => {
    const changeArr = [];
    configData.forEach((c, id) => {
      if (c.newValue && values[id]?.[0] && c.newValue != values[id]?.[0]) {
        changeArr.push({
          contract: c.contract,
          abi: c.abi,
          value: c.newValue,
          method: c.setter,
        });
      }
      setChangeData(changeArr);
      setConfigData((datas) => datas.map((d) => ({ ...d, newValue: null })));
    });
  };
  return (
    <>
      <ModalBase
        open={changeData.length > 0}
        onClose={() => {
          setChangeData([]), reset();
        }}
      >
        <div className={valueClasses + 'overflow-auto'}>
          {changeData.map((c) => (
            <div>
              {c.method}&nbsp;:&nbsp;{c.value}
            </div>
          ))}
        </div>
      </ModalBase>
      <div className="">
        <PoolDropDown />
      </div>
      <TableAligner
        keyStyle={keyClasses}
        valueStyle={valueClasses}
        keysName={configData.map((c, id) => c.market + ' : ' + c.getter)}
        values={values.map((v, id) => (
          <ValueEditor value={v[0]} id={id} />
        ))}
      ></TableAligner>
      <BlueBtn
        onClick={changeChanged}
        className="px-[20px] !my -[20px] !mx-auto !w-fit"
      >
        Chnage
      </BlueBtn>
    </>
  );
};

const ValueEditor: React.FC<{ value: string | number; id: number }> = ({
  value,
  id,
}) => {
  const [configData, setConfigData] = useAtom(configDataAtom);

  return (
    <div className="flex gap-x-[10px] items-center">
      <span
        className={
          configData[id].newValue &&
          value != configData[id].newValue &&
          'line-through decoration-[red] decoration-[2px]'
        }
      >
        {value}
      </span>
      <button
        onClick={() => {
          setConfigData((s) => {
            const updatedS = [...s];
            updatedS[id].selected = !updatedS[id].selected;
            updatedS[id].newValue = value;
            return updatedS;
          });
        }}
      >
        Edit
      </button>
      {configData[id].selected && (
        <BufferInput
          value={configData[id].newValue}
          onChange={(val) => {
            setConfigData((s) => {
              const updatedS = [...s];
              updatedS[id].newValue = val;
              return updatedS;
            });
          }}
        />
      )}
    </div>
  );
};
