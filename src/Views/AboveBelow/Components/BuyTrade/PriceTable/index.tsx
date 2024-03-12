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
  // console.log(increasingPriceArray, decreasingPriceArray);
  const HeaderFomatter = useCallback((col: number) => {
    // if (col == 1) {
    //   console.log(`index-selectedPoolMarket: `, selectedPoolMarket);
    //   return selectedPoolMarket?.poolInfo.token;
    // }

    return (
      <TableHeader
        col={col}
        key={headsArray[col]}
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
      } else if (
        selectedStrike?.[marketTVid]?.price === price &&
        selectedStrike?.[marketTVid]?.isAbove === isAbove
      ) {
        //remove the selecred strike
        setSelectedStrike((prvStrikes) => {
          const newStrikes = { ...prvStrikes };
          delete newStrikes[marketTVid];
          return newStrikes;
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
    // if (!tvId) return <></>;

    const tablerow = isAboveTable
      ? increasingPriceArray[row]
      : decreasingPriceArray[row];
    const strikePrice = tablerow?.strike;

    const isSelected =
      selectedStrike === undefined ||
      selectedStrike?.[tvId] === undefined ||
      selectedStrike?.[tvId]?.price === strikePrice.toString();

    /*
      
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
                {priceFormat === 'Asset'
                  ? totalFee.toFixed(2) //USDC
                  : (((1 - totalFee) / totalFee) * 100).toFixed(0) + '%'} //ROI
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
                {priceFormat === 'Asset'
                  ? fee.toFixed(2)
                  : (((1 - fee) / fee) * 100).toFixed(0) + '%'}
              </>
            )}
          </button>
        );

      
      */
    return <div>Hello</div>;
  };
  if (!currentPrice || !activeMarket || !strikes)
    return (
      <Skeleton className="w-[1005] !h-[300px] lc !transform-none !mt-3" />
    );
  // 3772FF
  const marketTVid = activeMarket?.tv_id;

  const isUpselected = selectedStrike?.[marketTVid]?.isAbove;

  return (
    <div className="text-f12 ">
      <div className="flex my-[10px] text-[15px] justify-around items-center font-[500] text-[#A5ADCF]">
        <div
          className={`${isUpselected ? 'text-1' : 'text-[#A5ADCF]'}  ${
            isUpselected
              ? 'underlihttps://www.youtube.com/watch?v=9F4EizRXzWI&list=RD9F4EizRXzWI&index=1ne decoration-[#3772FF]'
              : ''
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
        widths={['14%', '12%', '14%', '18%', '14%', '12%', '14%']}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, true)}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={increasingPriceArray.length + decreasingPriceArray.length}
        isHeaderTransparent
        shouldHideBody
        smHeight
        smThHeight
        noHover
        shouldShowMobile
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
