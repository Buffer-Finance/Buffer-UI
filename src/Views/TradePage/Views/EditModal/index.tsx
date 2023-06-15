import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import { TimeSelector } from '../BuyTrade/TimeSelector';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { MinutesInput } from '../Settings/TradeSettings/LimitOrdersExpiry/MinutesInput';
import { SaveButton } from './SaveButton';
import { DirectionButtons } from './DirectionButtons';
import {
  BuyTradeHeadText,
  EditTextValueText,
  SettingsComponentHeader,
} from '@Views/TradePage/Components/TextWrapper';
import { LimitOrderTradeSize, TriggerPrice } from './TriggerPrice';
import { useEffect, useState } from 'react';
import { directionBtn, marketType } from '@Views/TradePage/type';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { TimePicker } from '../BuyTrade/TimeSelector/TimePicker';
import { ModalBase } from 'src/Modals/BaseModal';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedOrderToEditAtom } from '@Views/TradePage/atoms';
import {
  OngoingTradeSchema,
  signatureCache,
} from '@Views/TradePage/Hooks/ongoingTrades';
import { divide, multiply, toFixed } from '@Utils/NumString/stringArithmatics';
import { timeToMins } from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';
import { editQueueTrade, generateTradeSignature } from '@Views/TradePage/utils';
import { useAccount } from 'wagmi';
import { HHMMToSeconds } from '@Views/TradePage/utils';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';

export const EditModal: React.FC<{
  trade: OngoingTradeSchema;
  market: marketType;
}> = ({ trade, market }) => {
  console.log(`index-trade: `, trade);
  const { address } = useAccount();
  const [buttonDirection, setButtonDirection] = useState(directionBtn.Up);
  const [frame, setFrame] = useState('m');
  const [minutes, setMinutes] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:15');
  const [size, setSize] = useState('0');
  const [price, setPrice] = useState('0');
  const [editLoading, setEditLoading] = useState<null | number>(null);
  const [periodValidations, setduration] = useState({
    min: '00:05',
    max: '24:00',
  });
  const { activeChain } = useActiveChain();
  console.log(`index-duration: `, trade);

  // things to get rom pool
  const poolDecimals = 6;
  useEffect(() => {
    if (!trade) return;
    setPrice(divide(trade.strike, 8)!);
    setMinutes(trade.limit_order_expiration / 60);
    setFrame('m');
    const pool = market.pools.find(
      (p) =>
        p.optionContract.toLowerCase() == trade.target_contract.toLowerCase()
    );
    // setCurrentTime(timeToMins())

    setSize(divide(trade.trade_size, poolDecimals)!);
    setButtonDirection(trade.is_above ? directionBtn.Up : directionBtn.Down);
    console.log(`ddindex-trade: `, trade.close_time - trade.queued_timestamp);
  }, [trade]);
  function onTimeChange(value: number) {
    setMinutes(value);
    //convert in whatever format needed
    if (frame === 'm') {
    } else {
    }
  }
  const { oneCTWallet } = useOneCTWallet();
  const toastify = useToast();
  const editHandler = async () => {
    // console.log('handle edit');
    if (!trade || !oneCTWallet || !address)
      return toastify({
        msg: 'Something went wrong',
        type: 'errror',
        id: 'dsfs',
      });
    setEditLoading(trade.queue_id);
    const currentTs = Math.round(Date.now() / 1e3);
    const signs = await generateTradeSignature(
      address,
      multiply(size, poolDecimals),
      HHMMToSeconds(currentTime),
      trade.target_contract,
      multiply(price, 8),
      trade.slippage + '',
      trade.allow_partial_fill,
      trade.referral_code,
      trade.trader_nft_id + '',
      currentTs,
      trade.settlement_fee,
      buttonDirection == directionBtn.Up ? true : false,
      oneCTWallet
    );
    console.log(`index-signs: `, signs);
    const res = editQueueTrade(
      signatureCache,
      trade.queue_id,
      currentTs,
      multiply(price, 8),
      HHMMToSeconds(currentTime),
      signs[0],
      signs[1],
      address,
      trade.slippage,
      buttonDirection == directionBtn.Up ? true : false,
      HHMMToSeconds(currentTime),
      activeChain.id
    );
    setEditLoading(null);
  };
  if (!trade) return <></>;
  return (
    <EditModalBackground>
      <RowGap gap="6px" className="mb-3">
        <div className="h-[20] w-[20px]">
          <PairTokenImage pair={market.pair} />
        </div>
        <SettingsComponentHeader fontSize="14px">
          {market.pair}
        </SettingsComponentHeader>
      </RowGap>
      <div className="data">
        <ColumnGap gap="12px">
          <LimitOrderTradeSize size={size} setSize={setPrice} />
          <TimePicker
            currentTime={currentTime}
            max_duration={periodValidations.max}
            min_duration={periodValidations.min}
            setCurrentTime={setCurrentTime}
          />{' '}
          <RowBetween>
            <BuyTradeHeadText>Order expiry time</BuyTradeHeadText>
            <MinutesInput
              activeFrame={frame}
              minutes={minutes}
              onChange={onTimeChange}
              setFrame={setFrame}
              inputClassName="border-none bg-[#282b39] text-f12"
            />
          </RowBetween>
          <TriggerPrice price={price} setPrice={setPrice} />
          <DirectionButtons
            activeBtn={buttonDirection}
            setActiveBtn={setButtonDirection}
          />
          <SaveButton
            isLoading={editLoading == trade.queue_id}
            onClick={editHandler}
          />
        </ColumnGap>
      </div>
    </EditModalBackground>
  );
};

const EditModalBackground = styled.div`
  background: linear-gradient(0deg, #232334, #232334),
    linear-gradient(0deg, #3a3b46, #3a3b46);
  border: 1px solid #3a3b46;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 16px 16px 12px;
  font-size: 12px;
  height: fit-content;
  width: fit-content;

  .data {
    padding: 4px;
  }
`;
