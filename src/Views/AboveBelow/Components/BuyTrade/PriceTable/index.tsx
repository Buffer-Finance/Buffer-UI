import { useToast } from '@Contexts/Toast';
import {
  strikePrices,
  useLimitedStrikeArrays,
} from '@Views/AboveBelow/Hooks/useLimitedStrikeArrays';
import {
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import BufferTable from '@Views/Common/BufferTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { CurrentPriceLine } from './CurrentPriceLine';

enum Columns {
  StrikePrice,
  Above,
  Below,
}

export const PriceTable = () => {
  useLimitedStrikeArrays();
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const headsArray = useMemo(() => ['Strike Price', 'Above', 'Below'], []);
  const [selectedStrike, setSelectedStrike] = useAtom(selectedPriceAtom);
  const toastify = useToast();
  const strikes = strikePrices[activeMarket?.tv_id as string];
  let increasingPriceArray = strikes?.increasingPriceArray ?? [];
  let decreasingPriceArray = strikes?.decreasingPriceArray ?? [];
  const HeaderFomatter = useCallback((col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={headsArray}
        className="text-start text-f13"
        firstColClassName="!ml-3"
      />
    );
  }, []);

  function setStrikePrice(isAbove: boolean, price: string) {
    try {
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
  const BodyFormatter: any = (
    row: number,
    col: number,
    isAboveTable: boolean
  ) => {
    const tvId = activeMarket?.tv_id;
    if (!tvId) return <></>;

    const tablerow = isAboveTable
      ? increasingPriceArray[row]
      : decreasingPriceArray[row];
    const strikePrice = tablerow?.strike;

    const isSelected =
      selectedStrike === undefined ||
      selectedStrike?.[tvId] === undefined ||
      selectedStrike?.[tvId]?.price === strikePrice.toString();

    switch (col) {
      case Columns.StrikePrice:
        return (
          <div className={`text-1 ${isSelected ? '' : 'opacity-20'}`}>
            <Display
              data={strikePrice}
              precision={precision}
              disable
              className="!justify-start"
            />
          </div>
        );
      case Columns.Above:
        const isAboveSelected =
          selectedStrike === undefined ||
          selectedStrike?.[tvId] === undefined ||
          (selectedStrike?.[tvId]?.isAbove && isSelected);
        const totalFee = tablerow.totalFeeAbove;

        return (
          <button
            className={`text-1 w-[90px] bg-[#4D81FF] ${
              totalFee === null ? 'cursor-not-allowed' : ''
            } rounded-l-sm
       px-3 py-1 whitespace-nowrap font-medium ${
         !isAboveSelected ? 'opacity-50' : ''
       }`}
            onClick={() => {
              if (totalFee !== null)
                setStrikePrice(true, strikePrice.toString());
            }}
          >
            {totalFee === null ? (
              '-'
            ) : (
              <>
                {totalFee.toFixed(2)} (
                {(((1 - totalFee) / totalFee) * 100).toFixed(0)}%)
              </>
            )}
          </button>
        );

      case Columns.Below:
        const isBelowSelected =
          selectedStrike === undefined ||
          selectedStrike?.[tvId] === undefined ||
          (!selectedStrike?.[tvId]?.isAbove && isSelected);
        const fee = tablerow.totalFeeBelow;

        return (
          <button
            className={`text-1 w-[90px] bg-[#FF5353] ${
              fee === null ? 'cursor-not-allowed' : ''
            } rounded-r-sm
       px-3 py-1 whitespace-nowrap font-medium ${
         !isBelowSelected ? 'opacity-50' : ''
       }`}
            onClick={() => {
              if (fee !== null) setStrikePrice(false, strikePrice.toString());
            }}
          >
            {fee === null ? (
              '-'
            ) : (
              <>
                {' '}
                {fee.toFixed(2)} ({(((1 - fee) / fee) * 100).toFixed(0)}%)
              </>
            )}
          </button>
        );

      default:
        return <div className=""></div>;
    }
  };
  if (!currentPrice || !activeMarket || !strikes)
    return (
      <Skeleton className="w-[1005] !h-[300px] lc !transform-none !mt-3" />
    );
  return (
    <div>
      <BufferTable
        headerJSX={HeaderFomatter}
        widths={['50%', '25%', '25%']}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, true)}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={0}
        isHeaderTransparent
        shouldHideBody
        smHeight
        smThHeight
        noHover
      />
      <PriceTableBackground className="pr-4 pl-3 max-h-[30vh] overflow-auto">
        <BufferTable
          headerJSX={HeaderFomatter}
          bodyJSX={(row: number, col: number) => BodyFormatter(row, col, true)}
          widths={['50%', '25%', '25%']}
          cols={headsArray.length}
          onRowClick={() => {}}
          rows={increasingPriceArray.length}
          isHeaderTransparent
          isBodyTransparent
          shouldHideHeader
          smHeight
          smThHeight
          noHover
          loading={increasingPriceArray.length === 0}
        />

        <CurrentPriceLine currentPrice={currentPrice} precision={precision} />
        <BufferTable
          headerJSX={HeaderFomatter}
          bodyJSX={(row: number, col: number) => BodyFormatter(row, col, false)}
          widths={['50%', '25%', '25%']}
          cols={headsArray.length}
          onRowClick={() => {}}
          rows={decreasingPriceArray.length}
          isBodyTransparent
          shouldHideHeader
          smThHeight
          smHeight
          noHover
          loading={decreasingPriceArray.length === 0}
        />
      </PriceTableBackground>
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
