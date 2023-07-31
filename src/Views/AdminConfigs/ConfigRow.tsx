import { useMemo, useState } from 'react';
import { Config, group2abi } from './helpers';
import { deepEqual } from 'wagmi';
import { useWriteCall } from '@Hooks/useWriteCall';

const ConfigRow: React.FC<any> = ({
  config,
  data,
  hideString,
}: {
  config: Config;
  data: any;
  hideString: string;
}) => {
  const [value, setValue] = useState(
    data?.[config.contract + config.getter?.name]
  );
  const { writeCall } = useWriteCall(config.contract, group2abi[config.group]);
  const text = config.getter?.name;
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1) + ' :';
  const isChanged = data?.[config.contract + config.getter?.name] != value;

  const isCurrentConfigSearched = () => {
    const str = `${
      config.market ? config.market.pair + ' ' + config.market.tv_id : ''
    } ${finalResult} ${config.getter.name} ${config.setter.name}`;
    return str.toLowerCase().includes(hideString.toLowerCase());
  };
  return (
    <div
      className={`flex  bg-2 rounded-[5px] p-2 gap-x-4 w-full px-4 py-2 ${
        hideString && (isCurrentConfigSearched() ? '' : 'hidden')
      }`}
    >
      <div className=" whitespace-nowrap">
        {finalResult + ' ' + config?.market?.pair}
      </div>
      {isChanged && (
        <div className="line-through decoration-[red] decoration-[2px]">
          {data?.[config.contract + config.getter?.name]}
        </div>
      )}
      <input
        className="bg-2 whitespace-nowrap w-full"
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
