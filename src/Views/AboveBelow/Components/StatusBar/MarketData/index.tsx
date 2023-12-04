import { marketTypeAB } from '@Views/AboveBelow/types';
import { OneDayChange } from './OneDayChange';

export const MarketData: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  const dataArray = [
    { head: '24h change', data: <OneDayChange activeMarket={activeMarket} /> },
  ];
  return (
    <>
      {dataArray.map((data, i) => {
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