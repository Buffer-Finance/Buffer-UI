import { toFixed } from '@Utils/NumString';
import { round } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/TradePage/Components/TextWrapper';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { limitOrderStrikeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { marketsForChart } from '@Views/TradePage/config';
import { joinStrings } from '@Views/TradePage/utils';
import { setDoccumentTitle } from '@Views/TradePage/utils/setDocumentTitle';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const CurrentPriceBackground = styled.div`
  margin-top: 7px;
`;

export const CurrentPrice: React.FC<{
  price: string;
}> = ({ price }) => {
  const { activeMarket } = useActiveMarket();
  const [tradeType] = useAtom(tradeTypeAtom);

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
  return (
    <CurrentPriceBackground>
      <RowBetween>
        <BuyTradeHeadText>
          <Trans>Price</Trans>
        </BuyTradeHeadText>
        {tradeType == 'Market' ? (
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
            className="w-[127px] text-right"
            activeAsset={activeMarket?.pair ?? ''}
          />
        )}
      </RowBetween>
    </CurrentPriceBackground>
  );
};

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
        type="number"
        pattern="^\d*(\.\d{0,2})?$"
        className={` bg-[#282B39] ${
          className ? className : '!text-right py-[1px] px-[1px] '
        }  rounded-sm w-[70%] outline-none`}
        value={strike ?? '0'}
        onChange={(e) => {
          // const decimals = e.target.value.split('.')[1];
          // if (decimals && decimals.length > precision) {
          //   return;
          // }
          setStrike(e.target.value);
        }}
      />
    </BuyTradeDescText>
  );
};
