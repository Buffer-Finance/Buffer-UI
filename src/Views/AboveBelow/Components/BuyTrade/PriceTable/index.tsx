import { useToast } from '@Contexts/Toast';
import {
  strikePrices,
  useLimitedStrikeArrays,
} from '@Views/AboveBelow/Hooks/useLimitedStrikeArrays';
import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  readCallDataAtom,
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
import { getAddress } from 'viem';
import { divide } from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';

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
  // useLimitedStrikeArrays();
  const [priceFormat, setPriceFormat] = useAtom(priceFormatAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  const readCallData = useAtomValue(readCallDataAtom);
  console.log('readCallData', readCallData);
  console.log(`index-markets: `, markets);

  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const maxPermissibleContracts = readCallData?.maxPermissibleContracts;
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
    if (maxPermissibleContracts === undefined) return <></>;

    let tablerow = totalArray[row];
    const strikePrice = tablerow?.strike;
    // console.log(
    //   `maxPermissibleContracts`,false
    //   maxPermissibleContracts[
    //     `${getAddress(activeMarket?.address)}${tablerow.marketID}${false}`
    //   ]
    // );
    const maxSizeBelow = maxPermissibleContracts[
      `${getAddress(activeMarket?.address)}${tablerow.marketID}${false}`
    ]
      ? toFixed(
          divide(
            maxPermissibleContracts[
              `${getAddress(activeMarket?.address)}${tablerow.marketID}${false}`
            ].maxPermissibleContracts,
            activeMarket?.poolInfo.decimals
          ),
          2
        )
      : '-';
    const maxSizeAbove = maxPermissibleContracts[
      `${getAddress(activeMarket?.address)}${tablerow.marketID}${true}`
    ]
      ? toFixed(
          divide(
            maxPermissibleContracts[
              `${getAddress(activeMarket?.address)}${tablerow.marketID}${true}`
            ].maxPermissibleContracts,
            activeMarket?.poolInfo.decimals
          ),
          2
        )
      : '-';
    switch (col) {
      case Columns.STRIKE:
        return (
          <div className={`text-1 w-full text-f12`}>
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
            className={`text-[#C3C2D4] w-full text-f12`}
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
            className={`text-[#C3C2D4] w-full text-f12`}
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
            className={`text-[#C3C2D4] w-full text-f12`}
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
            className={`text-[#C3C2D4] w-full text-f12`}
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
            className={`text-[#C3C2D4] w-full text-f12`}
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
            className={`text-[#C3C2D4] w-full text-f12`}
            onClick={() => {
              if (getROI(tablerow.totalFeeAbove) == '-') {
                return toastify({ type: 'error', msg: 'Invalid selection' });
              }
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeAbove ? tablerow.totalFeeAbove?.toFixed(2) : '-'}
          </button>
        );
      case Columns.MAX_ABOVE:
        return (
          <button
            className={`text-[#C3C2D4] w-full text-f12`}
            onClick={() => {
              if (getROI(tablerow.totalFeeAbove) == '-') {
                return toastify({ type: 'error', msg: 'Invalid selection' });
              }
              setStrikePrice(true, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeAbove
              ? toFixed(tablerow.totalFeeAbove * maxSizeAbove, 2)
              : '-'}
          </button>
        );
      case Columns.MAX_BELOW:
        return (
          <button
            className={`text-[#C3C2D4] w-full text-f12`}
            onClick={() => {
              if (getROI(tablerow.totalFeeBelow) == '-') {
                return toastify({ type: 'error', msg: 'Invalid selection' });
              }
              setStrikePrice(false, strikePrice.toString());
            }}
          >
            {tablerow.totalFeeBelow
              ? toFixed(tablerow.totalFeeBelow * maxSizeBelow, 2)
              : '-'}
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
    <div className="text-f12 text-1 flex flex-col gap-2 ">
      <div className="flex  my-[10px] text-[15px] justify-around items-center font-[500] text-[#A5ADCF]">
        <button
          className={`${isUpselected ? 'text-1' : 'text-[#A5ADCF]'}  ${
            isUpselected ? 'underline decoration-[#3772FF]' : ''
          } decoration-[2px]  leading-3 underline-offset-4`}
          onClick={() => {
            if (selectedStrikeD == -3) return;
            if (!isUpselected) {
              setStrikePrice(true, selectedStrikeD);
            }
          }}
        >
          {' '}
          Above
        </button>
        <button
          className={`${isUpselected ? 'text-[#A5ADCF]' : 'text-1'}  ${
            !isUpselected ? 'underline decoration-red' : ''
          } decoration-[2px]  leading-3 underline-offset-4`}
          onClick={() => {
            if (selectedStrikeD == -3) return;
            if (isUpselected) {
              setStrikePrice(false, selectedStrikeD);
            }
          }}
        >
          Below
        </button>
      </div>
      <BufferTableCopy
        headersJSX={headsArray}
        widths={['80px', '80px', '80px', '100px', '80px', '80px', '80px']}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col)}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={totalArray.length}
        // isHeaderTransparent
        isBodyTransparent
        // shouldHideHeader
        overflow="500px"
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
