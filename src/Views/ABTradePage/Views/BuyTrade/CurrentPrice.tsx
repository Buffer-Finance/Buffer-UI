import { priceAtom } from '@Hooks/usePrice';
import { getLastbar } from '@TV/useDataFeed';
import { toFixed } from '@Utils/NumString';
import { gt, round } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { EditIconSVG } from '@Views/ABTradePage/Components/EditIconSVG';
import { IconToolTip } from '@Views/ABTradePage/Components/IconToolTip';
import { RowBetween } from '@Views/ABTradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/ABTradePage/Components/TextWrapper';
import { useActiveMarket } from '@Views/ABTradePage/Hooks/useActiveMarket';
import {
  LimitOrderPayoutAtom,
  limitOrderStrikeAtom,
  tradeTypeAtom,
} from '@Views/ABTradePage/atoms';
import { marketsForChart } from '@Views/ABTradePage/config';
import { joinStrings } from '@Views/ABTradePage/utils';
import { setDoccumentTitle } from '@Views/ABTradePage/utils/setDocumentTitle';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export const CurrentPriceBackground = styled.div`
  margin-top: 7px;
`;

export const CurrentPrice: React.FC<{}> = ({}) => {
  const marketPrice = useAtomValue(priceAtom);

  const { activeMarket } = useActiveMarket();
  const price =
    getLastbar(marketPrice, {
      tv_id: activeMarket.tv_id,
    })?.price ?? '0';
  const [tradeType] = useAtom(tradeTypeAtom);
  const [activePayout, setActivePayout] = useAtom(LimitOrderPayoutAtom);

  const chartMarket =
    marketsForChart[
      joinStrings(
        activeMarket?.token0 ?? '',
        activeMarket?.token1 ?? '',
        ''
      ) as keyof typeof marketsForChart
    ];
  const precisePrice = toFixed(
    price,
    chartMarket.price_precision.toString().length - 1
  );
  const title = price ? precisePrice + ' | ' + chartMarket.tv_id : '';
  setDoccumentTitle(title);
  const precision = chartMarket.price_precision.toString().length - 1;
  const isMarket = tradeType == 'Market';
  return (
    <>
      {!isMarket && (
        <LimitOrderPayoutPicker
          activePayout={activePayout}
          setActivePayout={setActivePayout}
        />
      )}
      <CurrentPriceBackground>
        <RowBetween>
          <BuyTradeHeadText>
            <Trans>Price</Trans>
          </BuyTradeHeadText>
          {isMarket ? (
            <BuyTradeDescText>
              <Display
                data={round(price, precision)}
                precision={precision}
                className="!py-[1px]"
              />
            </BuyTradeDescText>
          ) : (
            <StrikePricePicker
              initialStrike={round(price, precision) as string}
              precision={precision}
              className="w-[127px] text-right px-3 py-1"
              activeAsset={activeMarket?.pair ?? ''}
            />
          )}
        </RowBetween>
      </CurrentPriceBackground>
    </>
  );
};
export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const StrikePricePicker: React.FC<{
  initialStrike: string;
  precision: number;
  className: string;
  activeAsset: string;
}> = ({ initialStrike, precision, className, activeAsset }) => {
  const [strike, setStrike] = useAtom(limitOrderStrikeAtom);
  useEffect(() => {
    setStrike(round(initialStrike, precision));
  }, [activeAsset]);
  return (
    <BuyTradeDescText className={` ${className} flex justify-end w-fit`}>
      <input
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        inputMode="decimal"
        autoCorrect="off"
        className={` bg-[#282B39] ${
          className ? className : '!text-right py-[1px] px-[1px] '
        }  rounded-sm w-[70%] outline-none`}
        value={strike ?? '0'}
        onChange={(e) => {
          // const decimals = e.target.value.split('.')[1];
          // if (decimals && decimals.length > precision) {
          //   return;
          // }
          // restrict the user from entering negative values
          // console.log(e.target.value, 'e.target.value');
          // if (e.target.value.includes('-')) {
          //   setStrike(e.target.value.replace('-', ''));
          // }
          if (inputRegex.test(escapeRegExp(e.target.value)))
            setStrike(e.target.value);
        }}
      />
    </BuyTradeDescText>
  );
};

export const LimitOrderPayoutPicker: React.FC<{
  className?: string;
  activePayout: string;
  setActivePayout: (newPayout: string) => void;
}> = ({ className = '', activePayout, setActivePayout }) => {
  const [shouldShowEdit, setShouldShowEdit] = useState(false);
  const payouts = ['60', '70'];
  const error = limitOrderPayoutError(activePayout);

  function handlePayoutClick(payout: string) {
    setActivePayout(payout);
    setShouldShowEdit(false);
  }

  function handleShouldShowEditClick() {
    setShouldShowEdit(true);
  }

  useEffect(() => {
    if (!payouts.includes(activePayout)) setShouldShowEdit(true);
  }, []);

  return (
    <div>
      <div className="flex gap-4 mt-3">
        <div className="flex gap-2 items-center">
          <div className="text-[#808191] text-f12">Payout</div>
          <div className="mt-1">
            <IconToolTip
              content={
                <>
                  Allows you to secure your trade by defining the least
                  acceptable payout. Even if the dynamic payout fluctuates, your
                  trade will only execute if it meets your set minimum.
                </>
              }
            />
          </div>
        </div>
        <div className="flex gap-2 items-stretch">
          {payouts.map((payout) => {
            const isActive = activePayout == payout;
            return (
              <button
                onClick={() => handlePayoutClick(payout)}
                key={payout}
                className={`text-f10 px-[6px] py-[3px] rounded-[2px] ${
                  isActive
                    ? 'bg-[#3772FF] text-1'
                    : 'bg-[#282B39] text-[#C3C2D4]'
                }`}
              >
                Above {payout}%
              </button>
            );
          })}
          {shouldShowEdit ? (
            <div className="relative w-[29%]">
              <input
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                inputMode="decimal"
                autoCorrect="off"
                className={`${
                  shouldShowEdit ? 'border border-[#3772FF]' : ''
                } bg-[#282B39] w-full h-full ${className} !text-left px-2 rounded-[2px] outline-none`}
                value={activePayout}
                placeholder="Enter "
                onChange={(e) => {
                  if (inputRegex.test(escapeRegExp(e.target.value)))
                    setActivePayout(e.target.value);
                }}
              />
              <EditIconSVG className="absolute right-1 top-[0] bottom-[0] scale-[70%]" />
            </div>
          ) : (
            <button
              className="rounded-[2px] bg-[#282B39]"
              onClick={handleShouldShowEditClick}
            >
              <EditIconSVG />
            </button>
          )}
        </div>
      </div>
      {error !== null && <div className="text-red mt-1">{error}</div>}
    </div>
  );
};

export function limitOrderPayoutError(activePayout: string): string | null {
  if (activePayout.includes('-')) {
    return 'Payout cannot be negative';
  }
  if (gt(activePayout || '0', '90')) {
    return 'Payout cannot be greater than 90%';
  }
  return null;
}
