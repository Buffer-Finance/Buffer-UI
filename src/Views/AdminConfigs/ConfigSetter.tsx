import { useCall2Data } from '@Utils/useReadCall';
import { useEffect, useMemo, useState } from 'react';
import { AssetDDRow } from './AssetDDRow';
import { ConfigRow } from './ConfigRow';
import { Config, group2abi } from './helpers';

const ConfigSetter: React.FC<any> = ({
  configs,
  cacheKey,
}: {
  configs: Config[];
  cacheKey: string;
}) => {
  const calls = useMemo(() => {
    return configs
      .filter((c) => c.getter)
      .map((c) => ({
        address: c.contract,
        name: c.getter.name,
        params: [],
        abi: group2abi[c.group],
      }));
  }, [configs]);
  const [searchIp, setSearchIp] = useState('');
  const { data } = useCall2Data(calls, 'admin-' + cacheKey);
  useEffect(() => setSearchIp(''), [configs]);
  console.log(configs, 'data');
  if (calls.length > 0 && !data) return <div>Loading..</div>;
  console.log(data, configs, 'data');

  return (
    <>
      <div className="flex">
        <div className="text-f14">Search&nbsp;:&nbsp;</div>
        <input
          value={searchIp}
          onChange={(e) => setSearchIp(e.target.value)}
          type="text"
          placeholder="Enter text to search"
          className="bg-[#2b3054] rounded-md p-2"
        />
      </div>
      <div className="bg-3 flex flex-col gap-y-2 px-4 py-2">
        {configs.map((c) =>
          c.type && c.type.toLowerCase() === 'assetdd' ? (
            <AssetDDRow config={c} />
          ) : (
            <ConfigRow
              key={c.contract + c.setter.name}
              config={c}
              data={data}
              hideString={searchIp}
            />
          )
        )}
      </div>
    </>
  );
};

export { ConfigSetter };
