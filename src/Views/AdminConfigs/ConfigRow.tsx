import { useEffect, useMemo, useState } from 'react';
import { Config, group2abi } from './helpers';
import { deepEqual } from 'wagmi';
import { useWriteCall } from '@Hooks/useWriteCall';
import { divide } from '@Utils/NumString/stringArithmatics';
import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { ResetSVG } from '@Views/TradePage/Components/ResetSVG';

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
    data?.[config.contract + config.getter?.name]?.[0]
  );
  // console.log(`ConfigRow-value: `, value);
  const [showIp, setShowIp] = useState(false);
  const { writeCall } = useWriteCall(config.contract, group2abi[config.group]);
  const text = config.getter?.name;
  console.log(`ConfigRow-config: `, config);
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1) + ' :';
  const isChanged = data?.[config.contract + config.getter?.name]?.[0] != value;

  const reset = () => {
    setShowIp(false);
    setValue(data?.[config.contract + config.getter?.name]);
  };
  const actualValue = data?.[config.contract + config.getter?.name]?.[0];
  let hint = config?.hint ? `(${config.hint})` : '';
  let dec = config.decimal ? `[${config.decimal} dec]` : '';
  const poolString = config.pool
    ? config.pool.token + ' ' + (config.pool.is_pol ? 'POL' : '')
    : '';
  const isCurrentConfigSearched = () => {
    const str = `${
      config.market ? config.market.pair + ' ' + config.market.tv_id : ''
    } ${finalResult} ${config.getter.name} ${
      config.setter.name
    } ${hint} ${dec} ${poolString}`;
    return str.toLowerCase().includes(hideString.toLowerCase());
  };
  const renderValue = () => {
    // single value but in wei
    if (config.decimal) {
      return divide(actualValue, config.decimal);
    }
    // bool
    if (config.getter.op?.[0].type == 'bool') {
      return actualValue ? 'true' : 'false';
    }
    // array
    if (config.getter.op?.[0].type.includes(['['])) {
      return actualValue.join(',');
    }
    // non decimal value
    return actualValue;
  };
  useEffect(() => {
    setValue(actualValue);
  }, [actualValue]);
  const changeConfig = (value: any) => {
    writeCall(
      (a) => {
        a && reset();
      },
      config.setter.name,
      value,
      null,
      null,
      null
    );
  };
  return (
    <div
      className={`  bg-2 rounded-[5px] p-2  w-full px-4 py-2 ${
        hideString && (isCurrentConfigSearched() ? '' : 'hidden')
      }`}
    >
      <form
        className="flex gap-x-4"
        onSubmit={(e) => {
          e.preventDefault();
          // single value
          let val = [value];

          // array
          if (value.includes(',')) {
            val = [value.split(',')];
          }
          changeConfig(val);
        }}
      >
        <div className=" whitespace-nowrap">
          {[finalResult, config?.market?.pair, hint, dec, poolString].join(' ')}
        </div>
        <div
          className={
            isChanged ? 'line-through decoration-[red] decoration-[2px]' : ''
          }
        >
          {renderValue()}
        </div>
        {isChanged ? (
          <button type="submit">Change</button>
        ) : (
          <button
            onClick={() => {
              if (config.setter.ip.length == 0) {
                return changeConfig([]);
              }
              setShowIp(true);
            }}
            type="button"
          >
            Edit
          </button>
        )}
        {showIp && (
          <>
            <input
              className="bg-2 whitespace-nowrap w-full"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <button onClick={reset}>
              <ResetSVG />
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export { ConfigRow };
