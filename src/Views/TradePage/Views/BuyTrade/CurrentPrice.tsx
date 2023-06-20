import { toFixed } from '@Utils/NumString';
import { round } from '@Utils/NumString/stringArithmatics';
import { roundToTwo } from '@Utils/roundOff';
import { setDoccumentTitle } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/TradePage/Components/TextWrapper';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { limitOrderStrikeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { marketsForChart } from '@Views/TradePage/config';
import { joinStrings } from '@Views/V3App/helperFns';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useAtom, useAtomValue } from 'jotai';
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
            <Display data={round(price, precision)} precision={precision} />
          </BuyTradeDescText>
        ) : (
          <StrikePricePicker initialStrike={price} />
        )}
      </RowBetween>
    </CurrentPriceBackground>
  );
};

const StrikePricePicker: React.FC<any> = ({
  initialStrike,
}: {
  initialStrike: string;
}) => {
  const [strike, setStrike] = useAtom(limitOrderStrikeAtom);
  useEffect(() => {
    console.log(`CurrentPrice-initialStrike: `, initialStrike);
    setStrike(initialStrike);
  }, []);
  return (
    <BuyTradeDescText className=" flex justify-end w-fit">
      <input
        type="number"
        step={1}
        min={0.0000001}
        className=" bg-[#282B39] !text-right px-3 py-[3px] rounded-sm w-[70%] outline-none"
        value={strike}
        onChange={(e) => {
          setStrike(e.target.value);
        }}
      />
    </BuyTradeDescText>
  );
};
