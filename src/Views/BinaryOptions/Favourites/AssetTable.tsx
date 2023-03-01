import { IconButton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import Star from 'public/ComponentSVGS/Star';
import { useMemo } from 'react';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { activeAssetStateAtom, FavouriteAtom, IMarket, useQTinfo } from '..';
import { useFavouritesFns } from '../Hooks/useFavouritesFns';
import { getFilteredAssets } from './Utils/getFilteredAssets';

const colMapping = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
};

export const AssetTable: React.FC<{
  assetsArray: IMarket[];
  activeCategory: string;
  onMarketSelect: (a: string) => void;
  searchText: string;
  catagories: string[];
}> = ({
  assetsArray,
  activeCategory,
  searchText,
  catagories,
  onMarketSelect,
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const [favourites, setFavourites] = useAtom(FavouriteAtom);
  const updatedArr = getFilteredAssets(
    assetsArray,
    searchText,
    activeCategory,
    catagories
  );
  const activeAssetStateHookData = useAtomValue(activeAssetStateAtom);

  const headers = useMemo(() => {
    return [
      '',
      'Asset',
      // "24H Change",
      <div className="flex items-center">Payout</div>,
    ];
  }, []);

  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  let BodyArr = updatedArr;

  const BodyFormatter = (row: number, col: number) => {
    const currentAsset: IMarket = BodyArr[row];

    if (isMobile) {
      col = colMapping[col];
    }
    const isFavourite = favourites.find(
      (favourite) => currentAsset.tv_id === favourite
    );
    switch (col) {
      case 1:
        return (
          <CellContent
            content={[
              <div className="flex">
                <img
                  src={currentAsset.img}
                  alt="AssetLogo"
                  className="width20 height20 mr-3"
                />
                <div className="text-1">{currentAsset.pair}</div>
              </div>,
            ]}
          />
        );
      // case 2:
      //   return (
      //     <CellContent
      //       content={[<LastDayChange currentAsset={currentAsset} />]}
      //     />
      //   );
      case 2:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center">
                <div className="mr3">
                  {activeAssetStateHookData.payouts
                    ? '+' +
                      activeAssetStateHookData.payouts[
                        currentAsset.pools[0].options_contracts.current
                      ] +
                      '%'
                    : 'loading...'}
                </div>
              </div>,
            ]}
          />
        );
      case 0:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center justify-center ">
                {/* <div className="mr3">{currentAsset.payout_range}</div> */}
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

      default:
        return <div>Unhandled Column.</div>;
    }
  };

  return (
    <BufferTable
      widths={['10%', 'auto', 'auto', 'auto']}
      headerJSX={HeadFormatter}
      cols={headers.length}
      shouldShowMobile
      className="h-[100%]"
      rows={BodyArr.length}
      tableClass={'!w-full'}
      bodyJSX={BodyFormatter}
      error={
        <TableErrorMsg
          msg="No Assets Found."
          onClick={() => {}}
          shouldShowWalletMsg={false}
        />
      }
      v1
      isBodyTransparent
      onRowClick={(rowNumber) => {
        const selectedAsset = BodyArr[rowNumber];
        onMarketSelect(selectedAsset.tv_id);
        console.log(`selectedAsset: `, selectedAsset.tv_id);
      }}
    />
  );
};
