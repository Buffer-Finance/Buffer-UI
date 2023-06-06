import { MarketChart } from './Views/MarketChart';
import { AccordionTable } from './Views/AccordionTable';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { BuyTrade } from './Views/BuyTrade';
import { AssetSelectorDD } from './Views/Markets/AssetSelectorDD';
import { PinnedMarkets } from './Views/Markets/PinnedMarkets';

const TradePage: React.FC<any> = ({}) => {
  return (
    <>
      <EssentialModals />
      <div className="flex justify-between w-[100%]">
        <div className="flex flex-col w-full">
          {/* <PinnedMarkets /> */}
          {/* <AssetSelectorDD /> */}
          <MarketChart />
          <AccordionTable />
        </div>
        <div className="h-[100%]">
          <BuyTrade />
        </div>
      </div>
    </>
  );
};

export { TradePage };

export const EssentialModals = () => {
  return (
    <>
      <OneCTModal />
    </>
  );
};
