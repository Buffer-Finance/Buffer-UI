import { priceAtom } from '@Hooks/usePrice';
import Star from '@Public/ComponentSVGS/Star';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { useAssetSelectorPool } from '@Views/TradePage/Hooks/useAssetSelectorPool';
import { useAssetTableFilters } from '@Views/TradePage/Hooks/useAssetTableFilters';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { useFavouriteMarkets } from '@Views/TradePage/Hooks/useFavouriteMarkets';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { marketType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import { IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

export const AssetSelectorTable: React.FC = () => {
  const {
    favouriteMarkets: favourites,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  } = useFavouriteMarkets();
  const { getSelectedPoolNotPol } = useAssetSelectorPool();
  const { getChartMarketData } = useChartMarketData();
  const { getPoolInfo } = usePoolInfo();
  const [marketPrice] = useAtom(priceAtom);

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
      navigateToMarket(market);
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
    if (!updatedArr) return <></>;
    const currentAsset: marketType = updatedArr[row];
    const pairName = joinStrings(currentAsset.token0, currentAsset.token1, '-');

    const selectedPool = getSelectedPoolNotPol(currentAsset);
    const poolInfo = getPoolInfo(selectedPool.pool);

    const isFavourite = findFavourite(currentAsset);
    const chartMarket = getChartMarketData(
      currentAsset.token0,
      currentAsset.token1
    );

    function onStarClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.stopPropagation();
      addOrRemoveFavourite(currentAsset, isFavourite);
    }

    const price = getPriceFromKlines(marketPrice, chartMarket);

    switch (col) {
      case 0:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center justify-center ">
                <IconButton onClick={onStarClick}>
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
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {toFixed(
                    price,
                    chartMarket.price_precision.toString().length - 1
                  )}
                </div>
              </div>,
            ]}
          />
        );
      case 3:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {selectedPool?.base_settlement_fee}%
                </div>
              </div>,
            ]}
          />
        );
      case 4:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {selectedPool?.max_fee} {poolInfo.token}
                </div>
              </div>,
            ]}
          />
        );
      case 5:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {divide(selectedPool?.openInterest ?? '0', poolInfo.decimals)}{' '}
                  {poolInfo.token}
                </div>
              </div>,
            ]}
          />
        );
      case 6:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">
                  {/* {currentAsset.maxOpenInterest.toFixed(2)} */}
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
    <BufferTable
      widths={['1%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']}
      headerJSX={HeadFormatter}
      cols={headers.length}
      shouldShowMobile
      tableBodyClass=""
      className="h-[100%]"
      rows={updatedArr?.length ?? 0}
      tableClass={'!w-full'}
      bodyJSX={BodyFormatter}
      error={
        <TableErrorMsg
          msg="No Assets Found."
          onClick={() => {}}
          shouldShowWalletMsg={false}
        />
      }
      loading={!updatedArr}
      v1
      isBodyTransparent
      isHeaderTransparent
      onRowClick={(rowNumber) => {
        if (!updatedArr) return;
        const selectedAsset = updatedArr[rowNumber];
        addOrRemoveFavourite(selectedAsset, findFavourite(selectedAsset));
      }}
    />
  );
};
