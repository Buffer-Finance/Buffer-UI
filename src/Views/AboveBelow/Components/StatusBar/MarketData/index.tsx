import { useOneDayVolume } from '@Views/AboveBelow/Hooks/useOneDayVolume';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { getAddress } from 'viem';
import { IV } from './IV';
import { OneDayChange } from './OneDayChange';
import { OneDayVolume } from './OneDayVolume';
import { OpenInterest } from './OpenInterest';

export const MarketData: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  console.log(`index-activeMarket: `, activeMarket);

  const { oneDayVolume } = useOneDayVolume();
  const dataArray = [
    { head: '24h change', data: <OneDayChange activeMarket={activeMarket} /> },
    {
      head: 'IV',
      data: <IV activeMarket={activeMarket} />,
    },
    {
      head: 'Bullish/Bearish',
      data: <OpenInterest activeMarket={activeMarket} />,
    },
    {
      head: 'Volume 24 hrs',
      data: (
        <OneDayVolume activeMarket={activeMarket} oneDayVolume={oneDayVolume} />
      ),
    },
  ];
  console.log(`index-dataArray: `, dataArray);

  let volume = undefined;
  if (activeMarket !== undefined && oneDayVolume !== undefined) {
    volume = oneDayVolume[getAddress(activeMarket.address)];
    console.log(`index-oneDayVolume: `, oneDayVolume, activeMarket.address);
  }
  const filteredDataArray = [...dataArray];
  if (volume === undefined || volume == '0') {
    filteredDataArray.splice(3, 1);
  }

  return (
    <>
      {filteredDataArray.map((data, i) => {
        return (
          <div
            key={data.head}
            className={`flex flex-col justify-center items-start gap-y-1 b1200:w-1/2`}
          >
            <span className="text-f12 b1200:text-f10 text-[#82828F] capitalize">
              {data.head}
            </span>
            <span className="text-f12 w-fit b1200:text-f10">{data.data}</span>
          </div>
        );
      })}
    </>
  );
};
