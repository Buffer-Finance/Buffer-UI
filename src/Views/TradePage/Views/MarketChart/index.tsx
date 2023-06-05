import { useState } from 'react';
import { MultiResolutionChart } from './MultiResolutionChart';
import { createArray } from '@Utils/JSUtils/createArray';
import { usePrice } from '@Hooks/usePrice';

const MarketChart: React.FC<any> = ({}) => {
  usePrice();
  const [chartTimes, setChartTimes] = useState(1);
  let chartLayout = <MultiResolutionChart market="BTCUSD" index={1} />;
  if (chartTimes == 2) {
    chartLayout = (
      <div className="flex">
        <div className="w-[50%]">
          <MultiResolutionChart market="BTCUSD" index={1} key={1} />
        </div>
        <div className="w-[50%]">
          <MultiResolutionChart market="BTCUSD" index={2} key={2} />
        </div>
      </div>
    );
  }
  if (chartTimes == 4) {
    chartLayout = (
      <div className="flex-col w-[50%]">
        <div className="flex">
          <div className="w-[50%]">
            <MultiResolutionChart market="BTCUSD" index={1} key={1} />
          </div>
          <div className="w-[50%]">
            <MultiResolutionChart market="BTCUSD" index={2} key={2} />
          </div>
        </div>
        <div className="flex">
          <div className="w-[50%]">
            <MultiResolutionChart market="BTCUSD" index={3} key={3} />
          </div>
          <div className="w-[50%]">
            <MultiResolutionChart market="BTCUSD" index={4} key={4} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => setChartTimes(1)}>1 Chart</button>
      <button onClick={() => setChartTimes(2)}>2 Chart</button>
      <button onClick={() => setChartTimes(4)}>4 Chart</button>
      {chartLayout}
    </div>
  );
};

export { MarketChart };
