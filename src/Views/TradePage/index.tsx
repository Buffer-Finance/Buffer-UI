import { MarketChart } from './Views/MarketChart';
import { AccordionTable } from './Views/AccordionTable';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { BuyTrade } from './Views/BuyTrade';
import { PinnedMarkets } from './Views/Markets/PinnedMarkets';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedOrderToEditAtom,
  tradePanelPositionSettingsAtom,
} from './atoms';
import { tradePanelPosition } from './type';
import { EditModal } from './Views/EditModal';
import { ModalBase } from 'src/Modals/BaseModal';

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
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const selectedTrade = useAtomValue(selectedOrderToEditAtom);

  return (
    <>
      <ModalBase
        className="!p-[0px]"
        open={selectedTrade ? true : false}
        onClose={() => setSelectedTrade(null)}
      >
        <EditModal
          trade={selectedTrade?.trade!}
          onSave={() => {
            console.log(`index-setSelectedTrade: `, setSelectedTrade);
            setSelectedTrade(null);
          }}
          market={selectedTrade?.market!}
        />
      </ModalBase>
      <OneCTModal />
    </>
  );
};
