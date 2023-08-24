import { priceAtom } from '@Hooks/usePrice';
import Star from '@Public/ComponentSVGS/Star';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import {
  marketData,
  useAssetTableFilters,
} from '@Views/TradePage/Hooks/useAssetTableFilters';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useFavouriteMarkets } from '@Views/TradePage/Hooks/useFavouriteMarkets';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { usePriceChange } from '@Views/TradePage/Hooks/usePriceChange';
import { AssetCategory } from '@Views/TradePage/type';
import { IconButton } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { OneDayChange } from './OneDayChange';
import styled from '@emotion/styled';
import { ForexTimingsModalAtom, searchBarAtom } from '@Views/TradePage/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { CloseTag } from './CloseTag';
import { getAddress } from 'viem';
import { Payout } from '@Views/TradePage/Views/MarketChart/Payout';

export const AssetSelectorTable: React.FC<{ group?: string }> = ({ group }) => {
  const {
    favouriteMarkets: favourites,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  } = useFavouriteMarkets();
  const isMobile = typeof group == 'string';
  const setForexTimingsModal = useSetAtom(ForexTimingsModalAtom);
  const { getPoolInfo } = usePoolInfo();
  const readcallData = useBuyTradeData();

  const headers = useMemo(() => {
    return [
      '',
      'Asset',
      '24h Change',
      'Payout',
      'Max Trade Size',
      'Current OI',
      'Max OI',
    ];
  }, [isMobile]);
  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  function addOrRemoveFavourite(market: marketData, isFavourite: boolean) {
    if (isFavourite) {
      removeFavouriteMarket(market);
    } else {
      addFavouriteMarket(market);
      // navigateToMarket(market);
    }
  }

  function findFavourite(market: marketData) {
    const chartMarket = market.marketInfo;

    return !!favourites.find(
      (favourite) => chartMarket.tv_id === favourite.marketInfo.tv_id
    );
  }

  const { filteredMarkets: updatedArr } = useAssetTableFilters(group);

  const searchValue = useAtomValue(searchBarAtom);
  const BodyFormatter = (row: number, col: number) => {
    if (!updatedArr) return <>-</>;
    const currentAsset = updatedArr[row];
    const pairName = currentAsset.marketInfo.pair;

    const isFavourite = findFavourite(currentAsset);

    function onStarClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.stopPropagation();
      addOrRemoveFavourite(currentAsset, isFavourite);
    }

    if (!readcallData) return <>-</>;

    const poolInfo = getPoolInfo(getAddress(currentAsset.poolContract));

    const maxFee = divide(
      readcallData?.maxTradeSizes[currentAsset.configContract.address] ?? '0',
      poolInfo.decimals
    ) as string;
    const maxOI = divide(
      readcallData.maxOIs[currentAsset.configContract.address] ?? '0',
      poolInfo.decimals
    );
    const currentOI = divide(
      readcallData.currentOIs[currentAsset.configContract.address] ?? '0',
      poolInfo.decimals
    );

    const isForex =
      currentAsset.category === AssetCategory.Forex ||
      currentAsset.category === AssetCategory.Commodities;

    const isOpen = getIsOpen(
      isForex,
      readcallData.isInCreationWindow,
      currentAsset
    );

    switch (col) {
      case 0:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center justify-center ">
                <IconButton onClick={onStarClick} className="!p-[0]">
                  <Star active={isFavourite} />
                </IconButton>
              </div>,
            ]}
          />
        );
      case 1:
        return (
          <CellContent
            content={[
              <div className="flex ">
                <div className="w-[20px] h-[20px]">
                  <PairTokenImage pair={pairName} />
                </div>
                <div className="text-1 ml-3">{pairName}</div>
              </div>,
            ]}
          />
        );

      case 2:
        if (!isOpen)
          return (
            <ColumnGap gap="4px " className="b1200:items-end">
              <CloseTag />
              {isForex && (
                <ShowTimingModalButton
                  onClick={() => setForexTimingsModal(true)}
                >
                  Schedule
                </ShowTimingModalButton>
              )}
            </ColumnGap>
          );
        return (
          <CellContent
            content={[
              <div className="flex flex-col items-start b1200:items-end">
                <CurrentPrice currentAsset={currentAsset} />
                <OneDayChangeComponent currentAsset={currentAsset} />
              </div>,
            ]}
          />
        );
      case 3:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  <Payout
                    token0={currentAsset.marketInfo.token0}
                    token1={currentAsset.marketInfo.token1}
                  />
                </div>
              </div>,
            ]}
          />
        );
      case 4:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {maxFee} {poolInfo.token}
                </div>
              </div>,
            ]}
          />
        );
      case 5:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {currentOI} {poolInfo.token}
                </div>
              </div>,
            ]}
          />
        );
      case 6:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {maxOI} {poolInfo.token}
                </div>
              </div>,
            ]}
          />
        );

      default:
        return <div>Unhandled Column.</div>;
    }
  };

  if (!updatedArr.length && group && searchValue.length > 0) return null;
  return (
    <AssetSelectorDDBackground>
      <BufferTable
        widths={['1%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']}
        headerJSX={isMobile ? null : HeadFormatter}
        cols={isMobile ? 3 : headers.length}
        shouldShowMobile
        rows={updatedArr?.length ?? 0}
        bodyJSX={BodyFormatter}
        tableClass="b1200:!w-full assetSelectorTableWidth"
        error={
          <TableErrorMsg
            msg="No Assets Found."
            onClick={() => {}}
            shouldShowWalletMsg={false}
          />
        }
        loading={!updatedArr}
        isBodyTransparent
        isHeaderTransparent
        onRowClick={(rowNumber) => {
          if (!updatedArr) return;
          const selectedAsset = updatedArr[rowNumber];
          navigateToMarket(selectedAsset);
          // addOrRemoveFavourite(selectedAsset, findFavourite(selectedAsset));
        }}
        overflow
      />
    </AssetSelectorDDBackground>
  );
};

const CurrentPrice = ({ currentAsset }: { currentAsset: marketData }) => {
  const [marketPrice] = useAtom(priceAtom);
  const price = getPriceFromKlines(marketPrice, {
    tv_id: currentAsset.marketInfo.tv_id,
  });
  return (
    <div className="text-1">
      {toFixed(
        price,
        currentAsset.marketInfo.price_precision.toString().length - 1
      )}
    </div>
  );
};

const OneDayChangeComponent = ({
  currentAsset,
}: {
  currentAsset: marketData;
}) => {
  const assetPrices = usePriceChange();
  const oneDayChange = (
    assetPrices?.[currentAsset.marketInfo.tv_id]?.change ?? 0
  ).toFixed(2);
  return (
    <div>
      <OneDayChange oneDayChange={oneDayChange} />
    </div>
  );
};

const AssetSelectorDDBackground = styled.div`
  .assetSelectorTableWidth {
    width: min(100vw, 720px);
  }
`;

const ShowTimingModalButton = styled.button`
  color: #808191;
  background: transparent;
  border: none;
  outline: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-size: 10px;
  width: fit-content;
`;

const getIsOpen = (
  isForex: boolean,
  isInCreationWindow: boolean,
  currentAsset: marketData
) => {
  if (isForex && !isInCreationWindow) return false;

  return !currentAsset.isPaused;
};
