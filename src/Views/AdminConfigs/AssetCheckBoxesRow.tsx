import { useWriteCall } from '@Hooks/useWriteCall';
import { BufferCheckBoxes } from '@Views/Common/BufferCheckBoxes';
import {
  useMarketsRequest,
  useV2Markets,
} from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { responseObj } from '@Views/TradePage/type';
import { useState } from 'react';
import { Config, group2abi } from './helpers';

export const AssetChechBoxesRow = ({ config }: { config: Config }) => {
  const { writeCall } = useWriteCall(config.contract, group2abi[config.group]);
  const { data: marketsV2 } = useV2Markets();
  const { data: marketsV2_5 } = useMarketsRequest();
  const [selectedV2Assets, setSelectedV2Assets] = useState<{
    [key: string]: responseObj[];
  }>({});
  const [selectedV2_5Assets, setSelectedV2_5Assets] = useState<{
    [key: string]: responseObj[];
  }>({});

  if (
    marketsV2_5.optionContracts === undefined ||
    marketsV2.optionContracts === undefined
  )
    return <div>Loading...</div>;

  function filter(market: responseObj) {
    if (config.setter.name.toLowerCase() === 'pause') return !market.isPaused;
    return market.isPaused;
  }

  function handleChange() {
    const v2Addresses = Object.values(selectedV2Assets)
      .map((a) => a.map(mapToAddress))
      .flat();
    const v2_5Addresses = Object.values(selectedV2_5Assets)
      .map((a) => a.map(mapToAddress))
      .flat();
    writeCall(
      (a) => {
        console.log(a);
        setSelectedV2Assets({});
        setSelectedV2_5Assets({});
      },
      config.setter.name,
      [v2Addresses, v2_5Addresses],
      undefined,
      null,
      null
    );
  }

  function handleCheckBoxClick(
    selectedTab: string,
    isV2: boolean,
    pool: string
  ) {
    if (isV2) {
      if (selectedV2Assets[pool]?.map(mapToAssetName).includes(selectedTab)) {
        setSelectedV2Assets((prev) => ({
          ...prev,
          [pool]: prev[pool].filter((a) => a.asset !== selectedTab),
        }));
      } else {
        setSelectedV2Assets((prev) => ({
          ...prev,
          [pool]: [
            ...(prev[pool] ?? []),
            marketsV2.optionContracts.find(
              (market) => market.asset === selectedTab && market.pool === pool
            )!,
          ],
        }));
      }
    } else {
      if (selectedV2_5Assets[pool]?.map(mapToAssetName).includes(selectedTab)) {
        setSelectedV2_5Assets((prev) => ({
          ...prev,
          [pool]: prev[pool].filter((a) => a.asset !== selectedTab),
        }));
      } else {
        setSelectedV2_5Assets((prev) => ({
          ...prev,
          [pool]: [
            ...(prev[pool] ?? []),
            marketsV2_5.optionContracts.find(
              (market) => market.asset === selectedTab && market.pool === pool
            )!,
          ],
        }));
      }
    }
  }

  function convertToPoolWiseData(data: responseObj[]): {
    [key: string]: string[];
  } {
    const poolWiseData: { [key: string]: string[] } = {};
    data.forEach((market) => {
      if (poolWiseData[market.pool]) {
        poolWiseData[market.pool].push(market.asset);
      } else {
        poolWiseData[market.pool] = [market.asset];
      }
    });
    return poolWiseData;
  }

  function mapToAssetName(data: responseObj) {
    return data.asset;
  }
  function mapToAddress(data: responseObj) {
    return data.address;
  }

  return (
    <div className="flex gap-3 text-f14 p-3">
      <div>{config.setter.name}</div>
      {config.setter.ip.map((ip) => {
        const isV2 = ip.name.toLowerCase() === 'markets_v2';
        let filteredData;

        if (isV2) {
          filteredData = marketsV2.optionContracts?.filter(filter) ?? [];
        } else filteredData = marketsV2_5.optionContracts?.filter(filter) ?? [];
        const poolWiseData = convertToPoolWiseData(filteredData);
        return (
          <div className="flex flex-col bg-[#232334] p-4 rounded-md">
            <div>{ip.name}:</div>

            {Object.keys(poolWiseData).map((pool) => {
              return (
                <div className="flex gap-3">
                  <div>{pool}:</div>
                  <BufferCheckBoxes
                    activeTabs={
                      isV2
                        ? (selectedV2Assets[pool] ?? []).map(mapToAssetName)
                        : (selectedV2_5Assets[pool] ?? []).map(mapToAssetName)
                    }
                    tabList={poolWiseData[pool]}
                    onCheckBoxClick={(selectedTab) =>
                      handleCheckBoxClick(selectedTab, isV2, pool)
                    }
                  />
                </div>
              );
            })}
            {/* 
            <BufferCheckBoxes
              activeTabs={isV2 ? selectedV2Assets : selectedV2_5Assets}
              tabList={filteredData.map((market) => market.asset)}
              onCheckBoxClick={(selectedTab) =>
                handleCheckBoxClick(selectedTab, isV2)
              }
            /> */}
          </div>
        );
      })}

      <button
        onClick={handleChange}
        className="bg-[#232334] h-fit p-3 rounded-md"
      >
        Change
      </button>
    </div>
  );
};
