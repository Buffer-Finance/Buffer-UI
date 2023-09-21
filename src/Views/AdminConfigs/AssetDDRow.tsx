import { useWriteCall } from '@Hooks/useWriteCall';
import {
  useMarketsRequest,
  useV2Markets,
} from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { responseObj } from '@Views/TradePage/type';
import { ClickEvent, MenuItem } from '@szhsin/react-menu';
import { useState } from 'react';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { Config, group2abi } from './helpers';

export const AssetDDRow = ({ config }: { config: Config }) => {
  const { writeCall } = useWriteCall(config.contract, group2abi[config.group]);
  const { data: marketsV2 } = useV2Markets();
  const { data: marketsV2_5 } = useMarketsRequest();
  const [selectedV2Assets, setSelectedV2Assets] = useState<string[]>([]);
  const [selectedV2_5Assets, setSelectedV2_5Assets] = useState<string[]>([]);

  if (marketsV2_5.optionContracts === undefined) return <div>Loading...</div>;

  function filter(market: responseObj) {
    if (config.setter.name.toLowerCase() === 'pause') return !market.isPaused;
    return market.isPaused;
  }

  function handleChange() {
    writeCall(
      (a) => {
        console.log(a);
      },
      config.setter.name,
      [selectedV2Assets, selectedV2_5Assets],
      undefined,
      null,
      null
    );
  }

  function handleOptionClick(option: responseObj, isV2: boolean) {
    if (isV2) {
      if (selectedV2Assets.includes(option.address)) {
        setSelectedV2Assets(
          selectedV2Assets.filter((a) => a !== option.address)
        );
      } else {
        setSelectedV2Assets([...selectedV2Assets, option.address]);
      }
    } else {
      if (selectedV2_5Assets.includes(option.address)) {
        setSelectedV2_5Assets(
          selectedV2_5Assets.filter((a) => a !== option.address)
        );
      } else {
        setSelectedV2_5Assets([...selectedV2_5Assets, option.address]);
      }
    }
  }

  function getIsSelected(option: responseObj, isV2: boolean) {
    if (isV2) {
      return selectedV2Assets.includes(option.address);
    } else {
      return selectedV2_5Assets.includes(option.address);
    }
  }

  return (
    <div className="flex gap-3 text-f14">
      <div>{config.setter.name}</div>
      {config.setter.ip.map((ip) => {
        const isV2 = ip.name.toLowerCase() === 'markets_v2';
        let filteredData;

        if (isV2) {
          filteredData = marketsV2.optionContracts?.filter(filter) ?? [];
        } else filteredData = marketsV2_5.optionContracts?.filter(filter) ?? [];
        return (
          <>
            <div>{ip.name}:</div>
            <MultiSelectDropdown
              options={filteredData.map((market) => (
                <Options
                  asset={market.asset + ' - ' + market.pool}
                  onClick={() => handleOptionClick(market, isV2)}
                  isSelected={getIsSelected(market, isV2)}
                />
              ))}
            />
          </>
        );
      })}

      <button onClick={handleChange}>Change</button>
    </div>
  );
};

const Options = ({
  asset,
  onClick,
  isSelected,
}: {
  asset: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <MenuItem
      className={({ hover }) => {
        return `!p-[0] ${hover ? '!rounded-[10px]' : ''}`;
      }}
      onClick={(e: ClickEvent) => {
        e.keepOpen = true;
      }}
    >
      {isSelected && <div className="w-3 h-3 bg-blue rounded-full mr-2"></div>}
      <button onClick={onClick}>{asset}</button>
    </MenuItem>
  );
};
