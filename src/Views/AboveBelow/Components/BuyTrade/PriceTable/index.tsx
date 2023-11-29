import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
import { useMemo } from 'react';
import { CurrentPriceLine } from './CurrentPriceLine';

enum Columns {
  StrikePrice,
  Above,
  Below,
}

export const PriceTable = () => {
  const headsArray = useMemo(() => ['Strike Price', 'Above', 'Below'], []);
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headsArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    switch (col) {
      case Columns.StrikePrice:
        return <div className="text-1 ml-[12px]">1.00</div>;
      case Columns.Above:
        return (
          <div className="text-1 bg-[#4D81FF] rounded-l-sm px-3 py-1 w-fit whitespace-nowrap">
            0.2 (25%)
          </div>
        );
      case Columns.Below:
        return (
          <div className="text-1 bg-[#FF5353] rounded-r-sm px-3 py-1 w-fit whitespace-nowrap">
            0.2 (25%)
          </div>
        );
      default:
        return <div className=""></div>;
    }
  };
  return (
    <div>
      <BufferTable
        headerJSX={HeaderFomatter}
        bodyJSX={BodyFormatter}
        widths={['100%', '0%', '0%']}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={5}
        isBodyTransparent
        isHeaderTransparent
      />
      <CurrentPriceLine price="37,380" />
      <BufferTable
        headerJSX={HeaderFomatter}
        bodyJSX={BodyFormatter}
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
