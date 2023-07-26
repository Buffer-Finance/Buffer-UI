import { IconButton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import Star from 'public/ComponentSVGS/Star';
import { useMemo } from 'react';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import {
  activeAssetStateAtom,
  FavouriteAtom,
  IMarket,
  mobileUpperBound,
} from '..';
import { PairTokenImage } from '../../TradePage/Views/PairTokenImage';
import { useActiveChain } from '@Hooks/useActiveChain';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { useV3AppFavouritesFns } from '@Views/V3App/Utils/useV3AppFavouriteFns';
import { getV3AppFilteredAssets } from '@Views/V3App/Utils/getFilteredAssets';
import { V3AppConfig } from '@Views/V3App/useV3AppConfig';
import { joinStrings } from '@Views/V3App/helperFns';
import { marketsForChart } from '@Views/V3App/config';

export const AssetTable: React.FC<{
  assetsArray: V3AppConfig[] | null;
  activeCategory: string;
  onMarketSelect: (a: string) => void;
  searchText: string;
}> = ({ assetsArray, activeCategory, searchText, onMarketSelect }) => {
  const [favourites, setFavourites] = useAtom(FavouriteAtom);
  const updatedArr = getV3AppFilteredAssets(
    assetsArray,
    searchText,
    activeCategory
  );
  const activeAssetStateHookData = useAtomValue(activeAssetStateAtom);
  const { addCardHandler, replaceAssetHandler } = useV3AppFavouritesFns();
  const { activeChain } = useActiveChain();
  const poolNames = usePoolNames();
  const payoutCols = useMemo(
    () =>
      poolNames
        .filter((pool) => !pool.toLowerCase().includes('pol'))
        .map((poolName) => `Payout ${poolName}`),
    [poolNames]
  );
  const headers = useMemo(() => {
    return ['', 'Asset', ...payoutCols];
  }, [activeChain]);
  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  const BodyFormatter = (row: number, col: number) => {
    if (!updatedArr) return <></>;
    const currentAsset: V3AppConfig = updatedArr[row];
    const pairName = joinStrings(currentAsset.token0, currentAsset.token1, '-');
    const pairNameForChart = joinStrings(
      currentAsset.token0,
      currentAsset.token1,
      ''
    );
    const chartMarket =
      marketsForChart[pairNameForChart as keyof typeof marketsForChart];

    const isFavourite = favourites.find(
      (favourite) => chartMarket.tv_id === favourite
    );
    switch (col) {
      case 0:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center justify-center ">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isFavourite) {
                      setFavourites([...favourites, chartMarket.tv_id]);
                    } else {
                      setFavourites(
                        favourites.filter(
                          (favourite) => favourite !== chartMarket.tv_id
                        )
                      );
                    }
                  }}
                >
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
        //TODO - v3 amke this dynamic
        return currentAsset.pools[0].base_settlement_fee + '%';

      default:
        return <div>Unhandled Column.</div>;
    }
  };

  return (
    <BufferTable
      widths={['10%', '35%', 'auto', 'auto']}
      headerJSX={HeadFormatter}
      cols={headers.length}
      shouldShowMobile
      tableBodyClass="!bg-2"
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
      onRowClick={(rowNumber) => {
        if (!updatedArr) return;
        const selectedAsset = updatedArr[rowNumber];
        const pairName = joinStrings(
          selectedAsset.token0,
          selectedAsset.token1,
          '-'
        );
        if (window.innerWidth < mobileUpperBound) {
          addCardHandler(selectedAsset);
          replaceAssetHandler(pairName);
          return;
        }
        onMarketSelect(pairName);
      }}
    />
  );
};
