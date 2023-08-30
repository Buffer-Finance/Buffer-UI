import { ModalBase } from 'src/Modals/BaseModal';
import {
  closeConfirmationModalAtom,
  closeLoadingAtom,
  miscsSettingsAtom,
} from './atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { useEffect, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { CloseOutlined } from '@mui/icons-material';
import { useCancelTradeFunction } from './Hooks/useCancelTradeFunction';
import { useOngoingTrades } from './Hooks/useOngoingTrades';

const CloseConfirmationModal: React.FC<any> = ({}) => {
  const trade = useAtomValue(closeConfirmationModalAtom);
  const setSetting = useSetAtom(miscsSettingsAtom);
  const settings = useAtomValue(miscsSettingsAtom);
  const setConfirmationTrade = useSetAtom(closeConfirmationModalAtom);
  const earlyCloseLoading = useAtomValue(closeLoadingAtom);
  const [activeTrades] = useOngoingTrades();
  const { earlyCloseHandler } = useCancelTradeFunction();
  const [val, setVal] = useState(false);
  useEffect(() => {
    if (!trade) return;
    const found = activeTrades.find((t) => t.queue_id == trade.queue_id);
    if (!found) {
      setConfirmationTrade(false);
    }
  }, [activeTrades, trade]);
  useEffect(() => {
    if (settings.earlyCloseConfirmation) {
      if (trade) {
        earlyCloseHandler(trade, trade.market);
      }
    }
  }, [settings.earlyCloseConfirmation]);
  return (
    <ModalBase
      open={trade ? true : false}
      onClose={() => {
        setConfirmationTrade(false);
      }}
      className=""
    >
      <div className="flex flex-col gap-y-[10px]">
        <div className="flex justify-between">
          <h2 className="text-f18 font-[500]">Close Postion</h2>
          <button
            className="p-3 sm:p-2 text-1 rounded-full bg-2"
            test-id="close-button"
            onClick={() => setConfirmationTrade(false)}
          >
            <CloseOutlined className="!scale-125 sm:!scale-100" />
          </button>{' '}
        </div>
        <div className="text-f18 text-[#C3C2D4]">
          Are you sure you want to close position?
        </div>
        <div className="text-f14 text-[#C3C2D4]">
          You can close your position at market price
        </div>
        <div
          className="flex items-center my-2 gap-x-[7px] text-f14 text-[ !text-f16 !w-fit  text-[#C3C2D4]"
          onClick={() => {
            setVal(!val);
          }}
        >
          <BufferCheckbox
            checked={val}
            onCheckChange={() => {
              setVal(!val);
            }}
            className="scale-75"
          />{' '}
          Don't Show this again
        </div>
        <div className="flex gap-x-[15px] ">
          <BlueBtn
            onClick={() => {
              setConfirmationTrade(false);
            }}
            className=" !text-f16 !w-fit !px-6 !h-[34px]  !bg-[#1C1C28]"
          >
            No
          </BlueBtn>
          <BlueBtn
            className=" !text-f16 !w-fit !px-6 !h-[34px]  "
            onClick={() => {
              if (val) {
                setSetting((s) => ({ ...s, earlyCloseConfirmation: true }));
              }
              earlyCloseHandler(trade, trade.market);
            }}
            isLoading={earlyCloseLoading?.[trade.queue_id] == 2}
          >
            Yes
          </BlueBtn>
        </div>
      </div>
    </ModalBase>
  );
};

export { CloseConfirmationModal };
