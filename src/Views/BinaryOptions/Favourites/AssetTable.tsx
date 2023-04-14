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
  useQTinfo,
} from '..';
import { useFavouritesFns } from '../Hooks/useFavouritesFns';
import { getFilteredAssets } from './Utils/getFilteredAssets';
import { PairTokenImage } from '../Components/PairTokenImage';
import { useActiveChain } from '@Hooks/useActiveChain';

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
  const { addCardHandler, replaceAssetHandler } = useFavouritesFns();
  const { activeChain } = useActiveChain();
  const headers = useMemo(() => {
    return [
      '',
      'Asset',
      <div className="flex items-center">Payout USDC</div>,
      'Payout ARB',
    ].slice(0, [42161, 421613].includes(activeChain.id) ? 4 : -1);
  }, [activeChain]);
  const HeadFormatter = (col: number) => {
    return <TableHeader col={col} headsArr={headers} />;
  };

  let BodyArr = updatedArr;

  const BodyFormatter = (row: number, col: number) => {
    if (!BodyArr) return <></>;
    const currentAsset: IMarket = BodyArr[row];
    const isFavourite = favourites.find(
      (favourite) => currentAsset.tv_id === favourite
    );
    switch (col) {
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
      case 3:
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
      widths={['10%', '35%', 'auto', 'auto']}
      headerJSX={HeadFormatter}
      cols={headers.length}
      shouldShowMobile
      tableBodyClass="!bg-2"
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
      loading={!BodyArr}
      v1
      isBodyTransparent
      onRowClick={(rowNumber) => {
        const selectedAsset = BodyArr[rowNumber];
        if (window.innerWidth < mobileUpperBound) {
          addCardHandler(selectedAsset);
          replaceAssetHandler(selectedAsset.pair, false);
          return;
        }
        if (!BodyArr) return;
        onMarketSelect(selectedAsset.pair);
        console.log(`selectedAsset: `, selectedAsset.tv_id);
      }}
    />
  );
};
