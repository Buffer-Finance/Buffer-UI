import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { MinutesInput } from '../Settings/TradeSettings/LimitOrdersExpiry/MinutesInput';
import { SaveButton } from './SaveButton';
import { DirectionButtons } from './DirectionButtons';
import {
  BuyTradeHeadText,
  EditTextValueText,
  SettingsComponentHeader,
} from '@Views/TradePage/Components/TextWrapper';
import { TriggerPrice } from './TriggerPrice';
import { useEffect, useMemo, useState } from 'react';
import { TradeType, directionBtn, marketType } from '@Views/TradePage/type';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { TimePicker } from '../BuyTrade/TimeSelector/TimePicker';
import { divide, multiply, toFixed } from '@Utils/NumString/stringArithmatics';
import { editQueueTrade, secondsToHHMM } from '@Views/TradePage/utils';
import { useAccount } from 'wagmi';
import { HHMMToSeconds } from '@Views/TradePage/utils';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Display } from '@Views/Common/Tooltips/Display';
import { getSingatureCached } from '@Views/TradePage/cache';
import { generateBuyTradeSignature } from '@Views/TradePage/utils/generateTradeSignature';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';

export const EditModal: React.FC<{
  trade: TradeType;
  onSave: () => void;
}> = ({ trade, onSave }) => {
  const [_, limitOrders] = useOngoingTrades();

  const { address } = useAccount();
  const [buttonDirection, setButtonDirection] = useState(directionBtn.Up);
  const [frame, setFrame] = useState('m');
  const [minutes, setMinutes] = useState(0);
  const [currentTime, setCurrentTime] = useState(secondsToHHMM(trade?.period));
  const [price, setPrice] = useState(divide(trade?.strike, 8));
  const [editLoading, setEditLoading] = useState<null | number>(null);
  const [periodValidations, setPeriodValidation] = useState({
    min: '00:05',
    max: '24:00',
  });
  const isMinuteFrame = frame === 'm';

  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const [elapsedMinutes, setElapsedMinutes] = useState<number | null>(null);
  const queuedTime = trade?.queued_timestamp;

  const { getPoolInfo } = usePoolInfo();

  useEffect(() => {
    const calculateElapsedMinutes = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const minutes = Math.floor((currentTime - queuedTime) / 60);
      setElapsedMinutes(minutes);
    };

    calculateElapsedMinutes(); // Execute immediately

    const interval = setInterval(calculateElapsedMinutes, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [queuedTime]);

  useEffect(() => {
    console.log('elapsedMinutes', elapsedMinutes);
  }, [elapsedMinutes]);

  const isSaveDisabled = useMemo(() => {
    if (minutes === null || minutes === undefined || minutes.toString() === '')
      return true;
    const currentTimeInMinutes = minutes;
    if (isMinuteFrame && currentTimeInMinutes < 1) return true;
    if (isMinuteFrame && currentTimeInMinutes > 60) return true;
    if (!isMinuteFrame && currentTimeInMinutes > 24) return true;
    if (!isMinuteFrame && currentTimeInMinutes < 1) return true;
    if (price === '') return true;
    if (price === '0') return true;
    if (elapsedMinutes) {
      if (elapsedMinutes >= 60) {
        if (isMinuteFrame && currentTimeInMinutes <= 60) return true;
        if (!isMinuteFrame && elapsedMinutes / 60 > currentTimeInMinutes)
          return true;
      } else {
        if (isMinuteFrame && currentTimeInMinutes <= elapsedMinutes)
          return true;
      }
    }

    const betTime = HHMMToSeconds(currentTime) / 60;
    if (betTime > HHMMToSeconds(periodValidations.max) / 60) return true;
    if (betTime < HHMMToSeconds(periodValidations.min) / 60) return true;
    return false;
  }, [trade, currentTime, price, frame, periodValidations, minutes]);

  useEffect(() => {
    if (!trade) return;
    const limitOrderDurationinMinutes = trade.limit_order_duration / 60;
    if (limitOrderDurationinMinutes > 60) {
      setFrame('h');
      setMinutes(limitOrderDurationinMinutes / 60);
    } else {
      setMinutes(limitOrderDurationinMinutes);
      setFrame('m');
    }

    // setCurrentTime(secondsToHHMM(trade.period));

    setPeriodValidation({
      min: trade.pool.min_duration,
      max: trade.pool.max_duration,
    });
    setButtonDirection(trade.is_above ? directionBtn.Up : directionBtn.Down);
  }, [trade]);

  useEffect(() => {
    if (isMinuteFrame && minutes > 60) {
      setMinutes(60);
    }
    if (frame.trim() === 'h' && minutes > 24) {
      setMinutes(24);
    }
  }, [frame]);

  function onTimeChange(value: number) {
    setMinutes(value);
  }
  const { oneCTWallet, oneCtPk } = useOneCTWallet();
  const toastify = useToast();
  const editHandler = async () => {
    if (!trade || !oneCTWallet || !address)
      return toastify({
        msg: 'Something went wrong',
        type: 'errror',
        id: 'dsfs',
      });
    setEditLoading(trade.queue_id);
    const currentTs = Math.round(Date.now() / 1000);
    const signs = await generateBuyTradeSignature(
      address,
      trade.trade_size + '',
      HHMMToSeconds(currentTime) / 60,
      trade.target_contract,
      price,
      trade.slippage + '',
      trade.allow_partial_fill,
      trade.referral_code,
      trade.trader_nft_id + '',
      currentTs,
      0,
      buttonDirection == directionBtn.Up ? true : false,
      oneCtPk,
      activeChain.id,
      configData.router
    );
    const signature = await getSingatureCached(oneCTWallet);
    if (!signature)
      return toastify({
        msg: 'Please activate your account first!',
        type: 'error',
        id: '1231',
      });
    const res = await editQueueTrade(
      signature,
      trade.queue_id,
      currentTs,
      toFixed(multiply(price, 8), 0),
      HHMMToSeconds(currentTime),
      signs[0],
      signs[1],
      address,
      trade.slippage,
      buttonDirection == directionBtn.Up ? true : false,
      frame === 'm' ? minutes * 60 : minutes * 60 * 60,
      activeChain.id
    );
    if (res) {
      onSave();
      return toastify({
        msg: 'Limit order updated successfully',
        type: 'success',
        id: '211',
      });
    }
    setEditLoading(null);
  };

  if (!trade) return <></>;
  const poolInfo = getPoolInfo(trade.pool.pool);

  const isLOProcessed = limitOrders.find((lo) => lo.queue_id == trade.queue_id)
    ? false
    : true;
  return (
    <EditModalBackground>
      <RowGap gap="6px" className="mb-3">
        <div className="h-[20] w-[20px]">
          <PairTokenImage pair={trade.market.pair} />
        </div>
        <SettingsComponentHeader fontSize="14px">
          {trade.market.pair}
        </SettingsComponentHeader>
      </RowGap>
      <div className="data">
        <ColumnGap gap="12px">
          <RowBetween>
            <BuyTradeHeadText>Trade size</BuyTradeHeadText>
            <EditTextValueText>
              <Display
                data={divide(trade.trade_size, poolInfo.decimals)}
                unit={'USDC'}
              />
            </EditTextValueText>
          </RowBetween>
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
              minMinutes={elapsedMinutes}
            />
          </RowBetween>
          <TriggerPrice price={price} setPrice={setPrice} />
          <DirectionButtons
            activeBtn={buttonDirection}
            setActiveBtn={setButtonDirection}
          />
          <SaveButton
            isDisabled={isLOProcessed || isSaveDisabled}
            disabledText={isLOProcessed ? 'Limit Order Processed!' : null}
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
