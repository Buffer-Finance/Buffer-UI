import { IconButton, Popover, Skeleton } from '@mui/material';
import { useState } from 'react';
import Background from './style';
import { useAtom, useAtomValue } from 'jotai';
import {
  activeAssetStateAtom,
  DisplayAssetsAtom,
  IMarket,
  MobileOnly,
  mobileUpperBound,
  useQTinfo,
  WebOnly,
} from '..';
import ShutterDrawer from 'react-bottom-drawer';
const activeClasses =
  'text-1 bg-[#131722] rounded-t-[10px] cursor-default  left-border-needed ';
import { FavouriteAssetDD } from './FavouriteAssetDD';
import { CloseOutlined } from '@mui/icons-material';
import { useFavouritesFns } from '../Hooks/useFavouritesFns';
import {
  getPriceFromKlines,
  marketPriceAtom,
} from 'src/TradingView/useDataFeed';
import { Display } from '@Views/Common/Tooltips/Display';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { Link, useNavigate } from 'react-router-dom';
import { PairTokenImage } from '../Components/PairTokenImage';
import { useShutterHandlers } from '../AmountSelector';
import { priceAtom } from '@Hooks/usePrice';

export default function Favourites({ className }: { className?: string }) {
  const [toggle, setToggle] = useState(false);
  const [assets] = useAtom(DisplayAssetsAtom);
  const [anchor, setAnchor] = useState(null);
  const qtInfo = useQTinfo();
  const activeAsset = qtInfo.activePair;
  const { activePoolObj } = useActivePoolObj();
  const { routerPermission } = useAtomValue(activeAssetStateAtom);

  const getFavourtiesObjs = () => {
    return assets
      .map((singleMarket) => {
        const foundMarket = qtInfo.pairs.find(
          (pair) => pair.pair === singleMarket
        );
        if (foundMarket) {
          const isAssetActive =
            routerPermission &&
            routerPermission[foundMarket.pools[0].options_contracts.current];
          if (!isAssetActive) return null;
          return foundMarket;
        } else return null;
      })
      .filter((singleMarket) => singleMarket);
  };

  if (!assets) {
    return <Skeleton className="lc w20 h4 sr" />;
  }

  const filteredAsset = assets.filter((singleMarket) =>
    qtInfo.pairs.find((m) => m.pair === singleMarket)
  );
  const { replaceAssetHandler } = useFavouritesFns();
  const { closeShutter } = useShutterHandlers();
  const FavourtiteAssetSelector = (
    <FavouriteAssetDD
      className="asset-dropdown-wrapper sm:!static nsm:!w-[500px] sm:!w-full"
      setToggle={setToggle}
    />
  );
  return (
    <Background
      className={
        className +
        ' sm:mb-[-6px]  top-[0] z-[101] bg-primary w-full  tb:!max-w-[100vw]'
      }
    >
      <div className="relative w-full b1200:h-[65px] a1200:h-[34px] scrollbarnil">
        <div className="dd-wrapper absolute top-[0px] left-[0px] right-[0px] bottom-[0px]">
          <IconButton
            className={` ${
              anchor && 'cross'
            } !pl-[0px] !pr-2 !pb-2 !pt-[4px] nsm:translate-x-[10px] `}
            onClick={(e) => {
              if (anchor) setAnchor(null);
              else {
                setAnchor(e.currentTarget);
              }
            }}
          >
            <svg
              width={25}
              height={25}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width={25} height={25} rx={5} fill="#2A2A3A" />
              <path
                className={`origin-center transition-transform  ${
                  anchor && 'rotate-45 '
                }`}
                d="M11.61 18.523V7h2.293v11.523h-2.292ZM7 13.903v-2.292h11.523v2.292H7Z"
                fill="#fff"
              />
            </svg>
          </IconButton>
          <MobileOnly>
            <ShutterDrawer
              className="bg-1 "
              isVisible={anchor ? true : false}
              onClose={() => {
                setAnchor(null);
              }}
              mountOnEnter
              unmountOnExit
            >
              <div className="relative text-1">{FavourtiteAssetSelector}</div>
            </ShutterDrawer>
          </MobileOnly>
          <WebOnly>
            <Popover
              anchorEl={anchor}
              open={Boolean(anchor)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={() => setAnchor(null)}
            >
              {FavourtiteAssetSelector}
            </Popover>
          </WebOnly>

          <div className=" b1200:w-full b1200:overflow-x-scroll overflow-x-scroll flex pr-3 pl-4 w-full tgp ">
            {assets.length ? (
              getFavourtiesObjs().map((singleMarket, index) => (
                <FavouriteCard
                  data={singleMarket}
                  key={index}
                  id={index}
                  isPrevActive={
                    filteredAsset.length &&
                    index &&
                    filteredAsset[index - 1] == activeAsset.pair
                  }
                  onCross={() => {
                    // if next exists, make next the selected.
                    if (index + 1 < filteredAsset.length) {
                      replaceAssetHandler(filteredAsset[index + 1], false);
                    }

                    // if prev exists make prev the selected.
                    else if (index > 0) {
                      replaceAssetHandler(filteredAsset[index - 1], false);
                    }
                    // make default asset selected
                    else replaceAssetHandler(assets[0], false);
                  }}
                />
              ))
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
      </div>
    </Background>
  );
}

function FavouriteCard({
  data,
  isPrevActive,
  id,
}: {
  data: IMarket;
  isPrevActive: boolean;
  id: number;
}) {
  const qtInfo = useQTinfo();
  const activeAsset = qtInfo.activePair;
  const isActive = data.tv_id === activeAsset.tv_id;
  console.log(`data.tv_id: `, data.tv_id, activeAsset.tv_id);
  const { deleteCardHandler } = useFavouritesFns();
  const [marketPrice] = useAtom(priceAtom);
  const price = getPriceFromKlines(marketPrice, data);
  const { routerPermission } = useAtomValue(activeAssetStateAtom);
  const isAssetActive =
    routerPermission &&
    routerPermission[data.pools[0].options_contracts.current];
  const navigate = useNavigate();
  // T w>m desktop, isActive : T, active F, inactive
  // F w<m mobile, isActive : T inactive , F active
  return (
    <div
      className={`cursor-pointer group mt-1 relative group pl-4 pr-3 py-3 text-2 flex flex-row items-center justify-between b1200:flex-col a1200:!min-w-[100px]  b1200:!px-3 b1200:rounded-md  b1200:mr-3  b1200:items-start ${
        window.innerWidth > mobileUpperBound === isActive
          ? activeClasses
          : `hover:bg-1 hover:rounded-t-[0px] b1200:bg-cross-bg after-border ${
              !isPrevActive && id ? 'before-border' : ''
            } ${!isAssetActive ? 'brightness-50' : ''} 
 `
      }`}
      onClick={() => navigate(`/binary/${data.pair}`)}
    >
      <button
        className="!absolute z-[10] text-1 !-right-3 -top-1 !bg-cross-bg rounded-full w-[17px] h-[17px] group-hover:visible nsm:invisible"
        onClick={(e) => {
          e.stopPropagation();
          deleteCardHandler(e, data, isActive);
        }}
      >
        <CloseOutlined className="!w-4" />
      </button>

      <div className="flex items-center">
        {/* <img
          src={data.img}
          alt={data.full_name}
          className="h-[18px] mr-2 tab:ml-2 b1200:hidden"
        /> */}
        <div className="text-f13 group-hover:text-3 whitespace-nowrap flex justify-start items-start text-3 mr-[0.4vw] b1200:flex-col">
          <span className="a1200:mr-3 flex b1200:mb-1 ">
            <div className="w-[18px] h-[18px] mr-[6px]">
              <PairTokenImage pair={data.pair} />
            </div>
            {data.pair}
          </span>
          {price ? (
            <Display
              className="text-left content-start items-center"
              data={price || '2'}
              disable
              unit={data.token2}
              colored
              precision={data.price_precision.toString().length - 1}
            />
          ) : (
            'Fetching...'
          )}
        </div>
      </div>
    </div>
  );
}
