import { useGenericHooks } from '@Hooks/useGenericHook';
import { usePriceRetriable } from '@Hooks/usePrice';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import styled from '@emotion/styled';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { ModalBase } from 'src/Modals/BaseModal';
import { CloseConfirmationModal } from './CloseConfirmationModal';
import { MarketTimingsModal } from './Components/MarketTimingsModal';
import { TradePageMobile } from './Components/MobileView/TradePageMobile';
import { useBuyTradeData } from './Hooks/useBuyTradeData';
import { ShareModal } from './Views/AccordionTable/ShareModal';
import { EditModal } from './Views/EditModal';
import {
  chartControlsSettingsAtom,
  rerenderPositionAtom,
  selectedOrderToEditAtom,
} from './atoms';

const TradePage: React.FC<any> = ({}) => {
  usePriceRetriable();
  useBuyTradeData();
  const { closeShutter } = useShutterHandlers();
  const isNotMobile = useMedia('(min-width:1200px)');
  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);
  return (
    <>
      <TradePageMobile />
    </>
  );
};

export { TradePage };

export const EssentialModals = () => {
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const setSettings = useSetAtom(chartControlsSettingsAtom);
  const selectedTrade = useAtomValue(selectedOrderToEditAtom);
  const setPositionRerender = useSetAtom(rerenderPositionAtom);
  const closeEditModal = () => {
    // on leaving edit modal
    if (selectedTrade?.default) {
      setPositionRerender((d) => d + 1);
    }
    setSelectedTrade(null);
  };
  useGenericHooks();

  return (
    <>
      <CloseConfirmationModal />

      <MarketTimingsModal />
      <ShareModal />
      <ModalBase
        className="!p-[0px]"
        open={selectedTrade ? true : false}
        onClose={closeEditModal}
      >
        <EditModal
          defaults={selectedTrade?.default}
          trade={selectedTrade?.trade!}
          onSave={(val: boolean) => {
            setTimeout(() => {
              setSettings((s) => {
                return {
                  ...s,
                  loDragging: val,
                };
              });
            }, 3000);
            setSelectedTrade(null);
          }}
          market={selectedTrade?.market!}
        />
      </ModalBase>
    </>
  );
};
