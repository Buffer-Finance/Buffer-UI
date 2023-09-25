import { useActiveChain } from '@Hooks/useActiveChain';
import { FavouriteAtom, mobileUpperBound } from '@Views/BinaryOptions';
import { useFavouritesFns } from '@Views/BinaryOptions/Hooks/useFavouritesFns';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Common/TableHead';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { getV3AppFilteredAssets } from '@Views/V3App/Utils/getFilteredAssets';
import { IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import Star from 'public/ComponentSVGS/Star';
import { useMemo } from 'react';
import { MarketInterface } from 'src/MultiChart';

export const AssetTable: React.FC<{
  assetsArray: MarketInterface[];
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
  console.log(`updatedArr: `, updatedArr);
  const { addCardHandler, replaceAssetHandler } = useFavouritesFns();
  const { activeChain } = useActiveChain();
  const poolNames = usePoolNames();

  const headers = useMemo(() => {
    return ['', 'Asset', 'Payout'];
  }, [activeChain]);
  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  const BodyFormatter = (row: number, col: number) => {
    if (!updatedArr) return <></>;
    const currentAsset: MarketInterface[] = updatedArr[row];
    console.log(`currentAsset: `, currentAsset);
    const isFavourite = favourites.find(
      (favourite) => currentAsset.tv_id === favourite
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
                      setFavourites([...favourites, currentAsset.tv_id]);
                    } else {
                      setFavourites(
                        favourites.filter(
                          (favourite) => favourite !== currentAsset.tv_id
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
                  <PairTokenImage pair={currentAsset.pair} />
                </div>
                <div className="text-1 ml-3">{currentAsset.pair}</div>
              </div>,
            ]}
          />
        );

      case 2:
        return '30%';

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
        if (window.innerWidth < mobileUpperBound) {
          addCardHandler(selectedAsset);
          replaceAssetHandler(selectedAsset.pair, false);
          return;
        }
        onMarketSelect(selectedAsset.pair);
      }}
    />
  );
};
