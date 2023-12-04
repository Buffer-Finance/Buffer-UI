import { useToast } from '@Contexts/Toast';
import { useStrikePriceArray } from '@Views/AboveBelow/Hooks/useStrikePriceArray';
import {
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
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
  const {
    currentPrice,
    decreasingPriceArray,
    increasingPriceArray,
    precision,
  } = useStrikePriceArray();
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const headsArray = useMemo(() => ['Strike Price', 'Above', 'Below'], []);
  const [selectedStrike, setSelectedStrike] = useAtom(selectedPriceAtom);
  const toastify = useToast();
  const HeaderFomatter = useCallback((col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={headsArray}
        className="text-center"
        firstColClassName="!text-start !pl-[0]"
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
    const strikePrice = isAboveTable
      ? increasingPriceArray[row]
      : decreasingPriceArray[row];
    const tvId = activeMarket?.tv_id;
    if (!tvId) return <></>;
    const isSelected =
      selectedStrike === undefined ||
      selectedStrike?.[tvId]?.price === strikePrice.toString();
    switch (col) {
      case Columns.StrikePrice:
        return (
          <div className={`text-1 ${isSelected ? '' : 'opacity-20'}`}>
            {strikePrice}
          </div>
        );
      case Columns.Above:
        const isAboveSelected =
          selectedStrike === undefined ||
          (selectedStrike?.[tvId]?.isAbove && isSelected);
        return (
          <button
            className={`text-1 bg-[#4D81FF] rounded-l-sm px-3 py-1 w-fit whitespace-nowrap font-medium ${
              !isAboveSelected ? 'opacity-20' : ''
            }`}
            onClick={() => setStrikePrice(true, strikePrice.toString())}
          >
            0.2 (25%)
          </button>
        );
      case Columns.Below:
        const isBelowSelected =
          selectedStrike === undefined ||
          (!selectedStrike?.[tvId]?.isAbove && isSelected);
        return (
          <button
            className={`text-1 bg-[#FF5353] rounded-r-sm px-3 py-1 w-fit whitespace-nowrap font-medium ${
              !isBelowSelected ? 'opacity-20' : ''
            }`}
            onClick={() => setStrikePrice(false, strikePrice.toString())}
          >
            0.2 (25%)
          </button>
        );
      default:
        return <div className=""></div>;
    }
  };
  if (!currentPrice || !activeMarket)
    return (
      <Skeleton className="w-[1005] !h-[300px] lc !transform-none !mt-3" />
    );
  return (
    <div className="px-3">
      <BufferTable
        headerJSX={HeaderFomatter}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, false)}
        widths={['100%', '0%', '0%']}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={5}
        isBodyTransparent
        isHeaderTransparent
      />
      <CurrentPriceLine currentPrice={currentPrice} precision={precision} />
      <BufferTable
        headerJSX={HeaderFomatter}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, true)}
        widths={['100%', '0%', '0%']}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={5}
        isBodyTransparent
        shouldHideHeader
      />
    </div>
  );
};
