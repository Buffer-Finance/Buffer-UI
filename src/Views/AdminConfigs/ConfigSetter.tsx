import { useMemo } from 'react';
import { Config, group2abi } from './helpers';
import { useCall2Data } from '@Utils/useReadCall';
import { ConfigRow } from './ConfigRow';

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

  const { data } = useCall2Data(calls, 'admin-' + cacheKey);
  if (!data) return <div>Loading..</div>;
  console.log(`ConfigSetter-data: `, data);
  return (
    <div className="bg-3 flex flex-col gap-y-2">
      Configs aisi daalo ki BFR aasmaan paaahunch jaaye
      {configs.map((c) => (
        <ConfigRow key={c.contract + c.setter.name} config={c} data={data} />
      ))}
    </div>
  );
};

export { ConfigSetter };
