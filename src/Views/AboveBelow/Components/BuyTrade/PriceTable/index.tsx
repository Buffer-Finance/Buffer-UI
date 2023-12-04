import { useToast } from '@Contexts/Toast';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { useSettlementFee } from '@Views/AboveBelow/Hooks/useSettlementFee';
import { useStrikePriceArray } from '@Views/AboveBelow/Hooks/useStrikePriceArray';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import BufferTable from '@Views/Common/BufferTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableHeader } from '@Views/TradePage/Views/AccordionTable/Common';
import { Skeleton } from '@mui/material';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { getAddress } from 'viem';
import { CurrentPriceLine } from './CurrentPriceLine';
import { Fee } from './Fee';

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
  // const { data: ivs } = useIV();
  const { data: settlementFees } = useSettlementFee();
  const selectedTimestamp = useAtomValue(selectedExpiry);

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
    // const iv = ivs?.[activeMarket.tv_id];
    // if (iv === undefined) return <></>;
    if (selectedTimestamp === undefined) return <></>;
    if (settlementFees === undefined) return <></>;
    const marketHash = solidityKeccak256(
      ['uint256', 'uint256'],
      [
        toFixed(multiply(strikePrice.toString(), 8), 0),
        Math.floor(selectedTimestamp / 1000) + 1,
      ]
    );
    const settlementFee =
      settlementFees[marketHash + '-' + getAddress(activeMarket.address)];

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
          (selectedStrike?.[tvId]?.isAbove && isSelected);

        return (
          <Fee
            isAbove
            currentPrice={currentPrice}
            expiration={selectedTimestamp}
            strikePrice={strikePrice}
            settlementFee={settlementFee?.sf_above || settlementFees['Base']}
            isSelected={isAboveSelected}
            setStrikePrice={setStrikePrice}
          />
        );
      case Columns.Below:
        const isBelowSelected =
          selectedStrike === undefined ||
          (!selectedStrike?.[tvId]?.isAbove && isSelected);
        return (
          <Fee
            isAbove={false}
            currentPrice={currentPrice}
            expiration={selectedTimestamp}
            strikePrice={strikePrice}
            settlementFee={settlementFee?.sf_above || settlementFees['Base']}
            isSelected={isBelowSelected}
            setStrikePrice={setStrikePrice}
          />
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
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, true)}
        widths={['100%', '0%', '0%']}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={5}
        isHeaderTransparent
        isBodyTransparent
        smHeight
        smThHeight
        noHover
      />

      <CurrentPriceLine currentPrice={currentPrice} precision={precision} />
      <BufferTable
        headerJSX={HeaderFomatter}
        bodyJSX={(row: number, col: number) => BodyFormatter(row, col, false)}
        widths={['100%', '0%', '0%']}
        cols={headsArray.length}
        onRowClick={() => {}}
        rows={5}
        isBodyTransparent
        shouldHideHeader
        smThHeight
        smHeight
        noHover
      />
    </div>
  );
};
