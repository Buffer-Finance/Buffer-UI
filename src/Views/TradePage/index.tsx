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
        className={`flex items-start h-screen w-full ${
          panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-scroll">
          <PinnedMarkets />
          <MarketChart />
          <AccordionTable />
        </div>

        <div className="overflow-y-hidden">
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
