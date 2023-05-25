import { useAtomValue } from 'jotai';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import { Display } from '@Views/Common/Tooltips/Display';
import { Background as AssetBackground } from '@Views/Common/v2-AssetDropDown/style';
import NumberTooltip from '@Views/Common/Tooltips';
import { useState } from 'react';
import Background from '@Views/BinaryOptions/Favourites/style';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { toFixed } from '@Utils/NumString';
import { priceAtom } from '@Hooks/usePrice';
import { setDoccumentTitle } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
// import { LastDayChange } from '@Views/NoLoss/Favourites/LastDayChange';
import { V3AppConfig } from '../useV3AppConfig';
import { useV3AppConfig } from '../useV3AppConfig';
import { joinStrings } from '../helperFns';
import { marketsForChart } from '../config';
import { V3MarketSelector } from './V3MarketSelector';
import { useV3AppActiveMarket } from '../Utils/useV3AppActiveMarket';
import { subtract } from '@Utils/NumString/stringArithmatics';
import { useSwitchPoolForTrade } from '../Utils/useSwitchPoolForTrade';
import { useV3AppData } from '../Utils/useV3AppReadCalls';
import { useNavigate } from 'react-router-dom';

export const V3ActiveAsset = ({ cb }) => {
  const marketPrice = useAtomValue(priceAtom);
  const [isOpen, setIsOpen] = useState(false);
  const markets = useV3AppConfig();
  const { activeMarket: singleAsset } = useV3AppActiveMarket();
  const navigate = useNavigate();
  if (!singleAsset || !markets) return <></>;

  const assetPair = joinStrings(singleAsset.token0, singleAsset.token1, '-');
  const chartMarket =
    marketsForChart[
      joinStrings(
        singleAsset.token0,
        singleAsset.token1,
        ''
      ) as keyof typeof marketsForChart
    ];
  const currentPrice = getPriceFromKlines(marketPrice, chartMarket);
  const title = currentPrice
    ? toFixed(currentPrice, chartMarket.price_precision.toString().length - 1) +
      ' | ' +
      chartMarket.tv_id
    : '';
  setDoccumentTitle(title);

  return (
    <AssetBackground className="relative min-w-full border-bottom ">
      {isOpen && (
        <>
          <Background className=" !translate-x-[-20%] !translate-y-[30px]">
            <V3MarketSelector
              onMarketSelect={(m) => {
                cb(m, 'charts');
                //TODO - v3 Change Url
                navigate('/v3/' + m);
                setIsOpen(false);
              }}
              markets={markets}
              className="asset-dropdown-wrapper left-[0] max-w-[300px] p-3"
            />
          </Background>
          <div id="overlay" onClick={() => setIsOpen(false)}></div>
        </>
      )}
      {/* <ShareModal qtInfo={qtInfo} /> */}

      <div className="px-5 py-3 rounded-[10px] y-auto  whitespace-nowrap pl-4">
        <div
          className={`flex items-center content-between assets w-full h-max`}
        >
          <div className="flex-col w-full items-stretch">
            <div className="w-full flex justify-between items-center text-3">
              <button
                className={`text-f14 flex items-center ${
                  !isOpen ? 'hover:brightness-125' : 'brightness-125'
                }  rounded`}
                onClick={() => setIsOpen((prvState) => !prvState)}
              >
                <div className=" w-[20px] h-[20px] mr-[5px]">
                  <PairTokenImage pair={assetPair} />
                </div>
                {assetPair}
                <DropdownArrow open={isOpen} />
              </button>
              <span className="flex flex-row items-end justify-end ml-3">
                {currentPrice ? (
                  <Display
                    data={currentPrice}
                    precision={
                      chartMarket.price_precision.toString().length - 1
                    }
                    unit={assetPair.split('-')[1]}
                    colored
                    className="text-1 text-f14 items-end justify-end leading-tight"
                  />
                ) : (
                  <>
                    <span className="text-1 text-f14 ">Fetching...</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <Payout />
              <div className="flex text-f12 justify-end items-center">
                {/* <LastDayChange currentAsset={singleAsset} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssetBackground>
  );
};

const Payout = () => {
  const { switchPool } = useSwitchPoolForTrade();
  const readcallData = useV3AppData();

  if (!readcallData || !switchPool) return <></>;
  const fullPayout = readcallData.totalPayout;
  const basePayout = switchPool.base_settlement_fee;
  const boostedPayout = subtract(fullPayout, basePayout);
  return (
    <div className="flex items-center mt-1">
      <NumberTooltip content={'Payout on winning'}>
        <div className="text-1 text-f13 cursor-pointer">
          {fullPayout ? '+' + fullPayout + '%' : 'loading...'}&nbsp;
          {boostedPayout && boostedPayout !== '0' ? (
            <span className="text-buffer-blue text-f12">
              {'(' + boostedPayout + '% Boosted)'}
            </span>
          ) : null}
        </div>
      </NumberTooltip>
    </div>
  );
};

export const getActiveMarket = (
  markets: V3AppConfig[] | null,
  params: any
): V3AppConfig | undefined => {
  let activeMarket = null;

  function findMarket(markets: V3AppConfig[], token0: string, token1: string) {
    return markets.find(
      (market) => market.token0 === token0 && market.token1 === token1
    );
  }

  if (!markets) return undefined;
  const urlMarket = params.market.toUpperCase();
  const [token0, token1] = urlMarket.split('-');
  const market = findMarket(markets, token0, token1);
  if (market) {
    activeMarket = market;
  } else {
    activeMarket = findMarket(markets, 'BTC', 'USD');
  }
  return activeMarket;
};
