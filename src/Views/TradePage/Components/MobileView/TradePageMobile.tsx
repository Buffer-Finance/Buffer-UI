import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';

const TradePageMobile: React.FC<any> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="h-[40vh]">
        <MultiResolutionChart market="BTCUSD" index={1} />
      </div>
    </div>
  );
};

export { TradePageMobile };
