import { useStrikePriceArray } from '@Views/AboveBelow/Hooks/useStrikePriceArray';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
import { Skeleton } from '@mui/material';
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
  const headsArray = useMemo(() => ['Strike Price', 'Above', 'Below'], []);
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

  const BodyFormatter: any = (
    row: number,
    col: number,
    isAboveTable: boolean
  ) => {
    const strikePrice = isAboveTable
      ? increasingPriceArray[row]
      : decreasingPriceArray[row];
    switch (col) {
      case Columns.StrikePrice:
        return <div className="text-1">{strikePrice}</div>;
      case Columns.Above:
        return (
          <div className="text-1 bg-[#4D81FF] rounded-l-sm px-3 py-1 w-fit whitespace-nowrap font-medium">
            0.2 (25%)
          </div>
        );
      case Columns.Below:
        return (
          <div className="text-1 bg-[#FF5353] rounded-r-sm px-3 py-1 w-fit whitespace-nowrap font-medium">
            0.2 (25%)
          </div>
        );
      default:
        return <div className=""></div>;
    }
  };
  if (!currentPrice)
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
