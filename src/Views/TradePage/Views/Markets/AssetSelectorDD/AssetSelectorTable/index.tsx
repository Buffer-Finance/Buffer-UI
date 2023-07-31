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
import { useAssetSelectorPool } from '@Views/TradePage/Hooks/useAssetSelectorPool';
import { useAssetTableFilters } from '@Views/TradePage/Hooks/useAssetTableFilters';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { useFavouriteMarkets } from '@Views/TradePage/Hooks/useFavouriteMarkets';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { usePriceChange } from '@Views/TradePage/Hooks/usePriceChange';
import { AssetCategory, marketType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import { IconButton } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { OneDayChange } from './OneDayChange';
import styled from '@emotion/styled';
import { ForexTimingsModalAtom } from '@Views/TradePage/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { CloseTag } from './CloseTag';

export const AssetSelectorTable: React.FC = () => {
  const {
    favouriteMarkets: favourites,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  } = useFavouriteMarkets();
  const setForexTimingsModal = useSetAtom(ForexTimingsModalAtom);

  const { getSelectedPoolNotPol } = useAssetSelectorPool();
  const { getChartMarketData } = useChartMarketData();
  const { getPoolInfo } = usePoolInfo();
  const readcallData = useBuyTradeData();

  const headers = useMemo(() => {
    return [
      '',
      'Asset',
      '24H Change',
      'Payout',
      'Max Trade Size',
      'Current OI',
      'Max OI',
    ];
  }, []);
  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  function addOrRemoveFavourite(market: marketType, isFavourite: boolean) {
    if (isFavourite) {
      removeFavouriteMarket(market);
    } else {
      addFavouriteMarket(market);
      // navigateToMarket(market);
    }
  }

  function findFavourite(market: marketType) {
    const chartMarket = getChartMarketData(market.token0, market.token1);

    return !!favourites.find(
      (favourite) =>
        chartMarket.tv_id ===
        joinStrings(favourite.token0, favourite.token1, '')
    );
  }

  const { filteredMarkets: updatedArr } = useAssetTableFilters();

  const BodyFormatter = (row: number, col: number) => {
    if (!updatedArr) return <>-</>;
    const currentAsset: marketType = updatedArr[row];
    const pairName = joinStrings(currentAsset.token0, currentAsset.token1, '-');

    const selectedPool = getSelectedPoolNotPol(currentAsset);

    const isFavourite = findFavourite(currentAsset);

    function onStarClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.stopPropagation();
      addOrRemoveFavourite(currentAsset, isFavourite);
    }

    if (!selectedPool || !readcallData) return <>-</>;

    const poolInfo = getPoolInfo(selectedPool.pool);
    const payout = readcallData?.settlementFees[selectedPool?.optionContract];
    const maxFee = divide(
      readcallData?.maxTradeSizes[selectedPool?.optionContract] ?? '0',
      poolInfo.decimals
    ) as string;
    const maxOI = divide(
      readcallData.maxOIs[selectedPool?.optionContract] ?? '0',
      poolInfo.decimals
    );
    const currentOI = divide(
      readcallData.currentOIs[selectedPool?.optionContract] ?? '0',
      poolInfo.decimals
    );

    const isForex =
      currentAsset.category === AssetCategory[AssetCategory.Forex] ||
      currentAsset.category === AssetCategory[AssetCategory.Commodities];

    const isOpen = getIsOpen(
      isForex,
      readcallData.isInCreationWindow,
      currentAsset,
      selectedPool.pool
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
              <div className="flex">
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
            <ColumnGap gap="4px">
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
              <div className="flex flex-col items-start">
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
                <div className="text-1">{payout}%</div>
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
  return (
    <AssetSelectorDDBackground>
      <BufferTable
        widths={['1%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']}
        headerJSX={HeadFormatter}
        cols={headers.length}
        shouldShowMobile
        rows={updatedArr?.length ?? 0}
        bodyJSX={BodyFormatter}
        tableClass="assetSelectorTableWidth"
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
      />
    </AssetSelectorDDBackground>
  );
};

const CurrentPrice = ({ currentAsset }: { currentAsset: marketType }) => {
  const [marketPrice] = useAtom(priceAtom);
  const price = getPriceFromKlines(marketPrice, {
    tv_id: currentAsset.tv_id,
  });
  return (
    <div className="text-1">
      {toFixed(price, currentAsset.price_precision.toString().length - 1)}
    </div>
  );
};

const OneDayChangeComponent = ({
  currentAsset,
}: {
  currentAsset: marketType;
}) => {
  const assetPrices = usePriceChange();
  const oneDayChange = (assetPrices?.[currentAsset.tv_id]?.change ?? 0).toFixed(
    2
  );
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
  currentAsset: marketType,
  currentPoolAddress: string
) => {
  if (isForex && !isInCreationWindow) return false;
  const currentPool = currentAsset.pools.find((pool) => {
    return pool.pool === currentPoolAddress;
  });
  return !currentPool?.isPaused;
};
