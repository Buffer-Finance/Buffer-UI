import { useMemo } from 'react';
import { Config, group2abi } from './helpers';
import { useCall2Data } from '@Utils/useReadCall';

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
  console.log(`ConfigSetter-data: `, data);
  return <div></div>;
};

export { ConfigSetter };
