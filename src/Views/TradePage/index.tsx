import { MarketChart } from './Views/MarketChart';
import { AccordionTable } from './Views/AccordionTable';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { BuyTrade } from './Views/BuyTrade';
import { PinnedMarkets } from './Views/Markets/PinnedMarkets';
import { useAtomValue } from 'jotai';
import { tradePanelPositionSettingsAtom } from './atoms';
import { tradePanelPosition } from './type';

const TradePage: React.FC<any> = ({}) => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  return (
    <>
      <EssentialModals />
      <div
        className={`flex justify-between w-[100%] ${
          panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex flex-col w-full">
          <PinnedMarkets />
          <MarketChart />
          <AccordionTable />
        </div>
        <div className="h-[100%] sticky">
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
