import { useState } from 'react';
import { Config, group2abi } from './helpers';
import { deepEqual } from 'wagmi';
import { useWriteCall } from '@Hooks/useWriteCall';

const ConfigRow: React.FC<any> = ({
  config,
  data,
}: {
  config: Config;
  data: any;
}) => {
  const [value, setValue] = useState(
    data?.[config.contract + config.getter?.name]
  );
  const { writeCall } = useWriteCall(config.contract, group2abi[config.group]);
  const text = config.getter?.name;
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1) + ' :';
  const isChanged = data?.[config.contract + config.getter?.name] != value;

  return (
    <div className="flex bg-2 rounded-[5px] p-2 gap-x-4 w-fit">
      <div>{finalResult}</div>
      {isChanged && (
        <div className="">{data?.[config.contract + config.getter?.name]}</div>
      )}
      <input
        className="bg-2 !w-fit"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {isChanged && (
        <>
          <button
            onClick={() => {
              writeCall(
                () => console.log(),
                config.setter.name,
                [value],
                null,
                null,
                null
              );
            }}
          >
            Change
          </button>
        </>
      )}
    </div>
  );
};

export { ConfigRow };
