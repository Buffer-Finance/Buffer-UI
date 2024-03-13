import { useToast } from '@Contexts/Toast';
import {
  strikePrices,
  useLimitedStrikeArrays,
} from '@Views/AboveBelow/Hooks/useLimitedStrikeArrays';
import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import BufferTable, { BufferTableCopy } from '@Views/Common/BufferTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { priceFormatAtom } from '../PriceFormat';
import { CurrentPriceLine } from './CurrentPriceLine';
import { activePoolObjAtom } from '@Views/TradePage/atoms';

enum Columns {
  ROI_ABOVE,
  TOKEN_ABOVE,
  MAX_ABOVE,
  STRIKE,
  ROI_BELOW,
  TOKEN_BELOW,
  MAX_BELOW,
}

export const getROI = (totalFee: number | null) => {
  if (totalFee == null) return '-';
  return (((1 - totalFee) / totalFee) * 100).toFixed(0) + '%';
};

export const PriceTable: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  useLimitedStrikeArrays();
  const [priceFormat, setPriceFormat] = useAtom(priceFormatAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  console.log(`index-markets: `, markets);

  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const headsArray = [
    'ROI',
    selectedPoolMarket?.poolInfo.token?.toUpperCase(),
    'Max',
    'Strike',
    'ROI',
    selectedPoolMarket?.poolInfo.token?.toUpperCase(),
    'Max',
  ];
  console.log(`index-headsArray: `, headsArray);
  const [selectedStrike, setSelectedStrike] = useAtom(selectedPriceAtom);
  const toastify = useToast();
  const strikes = strikePrices[activeMarket?.tv_id as string];
  let increasingPriceArray = strikes?.increasingPriceArray ?? [];
  let decreasingPriceArray = strikes?.decreasingPriceArray ?? [];
  let totalArray = [
    ...increasingPriceArray,
    { strike: -1 },
    ...decreasingPriceArray,
  ];
  // console.log(increasingPriceArray, decreasingPriceArray);

  function setStrikePrice(isAbove: boolean, price: string) {
    try {
      // console.log(`index-strikePrice: `, price,/ isAbove);

      if (!activeMarket) return;
      const marketTVid = activeMarket?.tv_id;
      if (!marketTVid) throw new Error('Trading View Id Not Found.');
      if (!price) throw new Error('Price Not Found.');
      if (selectedStrike === undefined) {
        setSelectedStrike({
          [marketTVid]: {
            price,
            isAbove,
          },
        });
      } else {
        setSelectedStrike((prvStrikes) => ({
          ...prvStrikes,
          [marketTVid]: {
            price,
            isAbove,
          },
        }));
      }
    } catch (e) {
      toastify({
        message: 'Error Setting Strike Price.' + (e as Error).message,
        type: 'error',
      });
    }
  }
  const throwError = () =>
    toastify({ type: 'error', msg: 'Invalid selection' });
  const BodyFormatter: any = (row: number, col: number) => {
    const tvId = activeMarket?.tv_id;
    if (!tvId) return <></>;

    let tablerow = totalArray[row];
    const strikePrice = tablerow?.strike;

    const isSelected =
      selectedStrike === undefined ||
      selectedStrike?.[tvId] === undefined ||
      selectedStrike?.[tvId]?.price === strikePrice.toString();

    switch (col) {
      case Columns.STRIKE:
        return (
          <div className={`text-1 `}>
            <Display
              data={strikePrice}
              precision={precision}
              disable
              className="!justify-center !items-center"
            />
          </div>
        );
      case Columns.ROI_ABOVE:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              if (getROI(tablerow.totalFeeAbove) == '-') {
                return toastify({ type: 'error', msg: 'Invalid selection' });
              }
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {getROI(tablerow.totalFeeAbove)}
          </button>
        );
      case Columns.ROI_BELOW:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              if (getROI(tablerow.totalFeeBelow) == '-') {
                return throwError();
              }
              setStrikePrice(false, strikePrice.toString());
            }}
          >
            {getROI(tablerow.totalFeeBelow)}
          </button>
        );
      case Columns.TOKEN_ABOVE:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              if (!tablerow.totalFeeAbove) {
                return throwError();
              }
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeAbove ? tablerow.totalFeeAbove?.toFixed(2) : '-'}
          </button>
        );
      case Columns.TOKEN_BELOW:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              if (!tablerow.totalFeeBelow) {
                return throwError();
              }
              setStrikePrice(false, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeBelow ? tablerow.totalFeeBelow?.toFixed(2) : '-'}
          </button>
        );
      case Columns.ROI_BELOW:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              if (getROI(tablerow.totalFeeBelow) == '-') {
                return toastify({ type: 'error', msg: 'Invalid selection' });
              }
              setStrikePrice(false, strikePrice.toString());
            }}
          >
            {getROI(tablerow.totalFeeBelow)}
          </button>
        );
      case Columns.TOKEN_ABOVE:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeAbove ? tablerow.totalFeeAbove?.toFixed(2) : '-'}
          </button>
        );
      case Columns.MAX_ABOVE:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {77777}
          </button>
        );
      case Columns.MAX_BELOW:
        return (
          <button
            className={`text-1 `}
            onClick={() => {
              setStrikePrice(false, strikePrice.toString());
            }}
          >
            {77777}
          </button>
        );
    }
  };
  if (!currentPrice || !activeMarket || !strikes)
    return (
      <Skeleton className="w-[1005] !h-[300px] lc !transform-none !mt-3" />
    );
  // 3772FF
  const marketTVid = activeMarket?.tv_id;

  const isUpselected = selectedStrike?.[marketTVid]?.isAbove ?? null;
  const selectedStrikeD = selectedStrike?.[marketTVid]?.price ?? -3;
  return (
    <div className="text-f12 text-1 ">
      <div className="flex my-[10px] text-[15px] justify-around items-center font-[500] text-[#A5ADCF]">
        <div
          className={`${isUpselected ? 'text-1' : 'text-[#A5ADCF]'}  ${
            isUpselected ? 'underline decoration-[#3772FF]' : ''
          } decoration-[2px]  leading-3 underline-offset-4`}
        >
          {' '}
          Above
        </div>
        <div
          className={`${isUpselected ? 'text-[#A5ADCF]' : 'text-1'}  ${
            !isUpselected ? 'underline decoration-[#3772FF]' : ''
          } decoration-[2px]  leading-3 underline-offset-4`}
        >
          Below
        </div>
      </div>
      <BufferTableCopy
        headersJSX={headsArray}
        widths={['100px', '100px', '100px', '100px', '100px', '100px', '100px']}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col)}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={totalArray.length}
        isHeaderTransparent
        isBodyTransparent
        // shouldHideHeader
        smHeight
        smThHeight
        noHover
        loading={increasingPriceArray.length === 0}
        shouldShowMobile
        customRow={
          <CurrentPriceLine currentPrice={currentPrice} precision={precision} />
        }
        customIdx={totalArray.findIndex((c) => c.strike == -1)}
        selectedRow={totalArray.findIndex((c) => c.strike == selectedStrikeD)}
        isAboveSelected={isUpselected}
      />
    </div>
  );
};

const PriceTableBackground = styled.div`
  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }
`;
