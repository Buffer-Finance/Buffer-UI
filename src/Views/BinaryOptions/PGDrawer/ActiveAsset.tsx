import { atom, useAtomValue } from 'jotai';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import { Display } from '@Views/Common/Tooltips/Display';
import { Background as AssetBackground } from '@Views/Common/v2-AssetDropDown/style';
import { activeAssetStateAtom, useQTinfo } from '..';
import NumberTooltip from '@Views/Common/Tooltips';
import { useMemo, useState } from 'react';
import Background from '../Favourites/style';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { toFixed } from '@Utils/NumString';
import { LastDayChange } from '../Favourites/LastDayChange';
import { PairTokenImage } from '../Components/PairTokenImage';
import { priceAtom } from '@Hooks/usePrice';
import { TVMarketSelector } from '../Favourites/TVMarketSelector';
import { useNavigate, useParams } from 'react-router-dom';
import { ShareModal } from '../Components/shareModal';
import { DynamicMarketSelector } from '@Views/NoLoss/Favourites/TVMarketSelector';
import { MarketInterface } from 'src/MultiChart';

export const chartReadyAtom = atom(false);
const setDoccumentTitle = (title) => {
  document.title = title;
};

export const ActiveAssetv0 = ({ cb }) => {
  const qtInfo = useQTinfo();
  const singleAsset = qtInfo.activePair;
  const marketPrice = useAtomValue(priceAtom);
  const currentPrice = getPriceFromKlines(marketPrice, qtInfo.activePair);
  const [isOpen, setIsOpen] = useState(false);
  const atomValue = useAtomValue(activeAssetStateAtom);
  const { activeAssetPayout: fullPayout, boostedPayout } = atomValue;

  const title = currentPrice
    ? toFixed(currentPrice, singleAsset.price_precision.toString().length - 1) +
      ' | ' +
      singleAsset.tv_id
    : '';
  setDoccumentTitle(title);
  const navigate = useNavigate();
  if (!singleAsset) return null;
  return (
    <AssetBackground className="relative min-w-full">
      {isOpen && (
        <>
          <Background>
            <TVMarketSelector
              onMarketSelect={(m) => {
                cb(m, 'charts');
                navigate('/binary/' + m);
                setIsOpen(false);
              }}
              className="asset-dropdown-wrapper left-[0] max-w-[300px] p-3"
            />
          </Background>
          <div id="overlay" onClick={() => setIsOpen(false)}></div>
        </>
      )}
      <ShareModal qtInfo={qtInfo} />

      <div className="flex flex-row justify-between items-center">
        <span className="text-f14 mb-2 ">Selected Pair</span>
      </div>
      <div className="px-5 py-3 rounded-[10px] y-auto bg-1  whitespace-nowrap">
        <div
          className={`flex items-center content-between assets w-full h-max`}
        >
          <div className="min-w-[30px] w-[30px] h-[30px] mr-3">
            <PairTokenImage pair={singleAsset.pair} />
          </div>
          <div className="flex-col w-full items-stretch">
            <div className="w-full flex justify-between items-center text-1">
              <button
                className={`text-f14 flex items-center bg-[#2c2c41] ${
                  !isOpen ? 'hover:brightness-125' : 'brightness-125'
                }  pl-3 rounded`}
                onClick={() => setIsOpen((prvState) => !prvState)}
              >
                {singleAsset.pair}
                <DropdownArrow open={isOpen} />
              </button>
              <span className="flex flex-row items-end justify-end ml-3">
                {currentPrice ? (
                  <Display
                    data={currentPrice}
                    precision={
                      singleAsset.price_precision.toString().length - 1
                    }
                    unit={singleAsset.token2}
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
              <div className="flex text-f12 justify-end items-center jus">
                <LastDayChange currentAsset={singleAsset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssetBackground>
  );
};
export const ActiveAsset = ({ cb }) => {
  const qtInfo = useQTinfo();
  const singleAsset = qtInfo.activePair;
  const marketPrice = useAtomValue(priceAtom);
  const currentPrice = getPriceFromKlines(marketPrice, qtInfo.activePair);
  const [isOpen, setIsOpen] = useState(false);
  const atomValue = useAtomValue(activeAssetStateAtom);
  const { activeAssetPayout: fullPayout, boostedPayout } = atomValue;

  const title = currentPrice
    ? toFixed(currentPrice, singleAsset.price_precision.toString().length - 1) +
      ' | ' +
      singleAsset.tv_id
    : '';
  setDoccumentTitle(title);
  const navigate = useNavigate();
  if (!singleAsset) return null;
  return (
    <AssetBackground className={`relative min-w-full $`}>
      {isOpen && (
        <>
          <Background>
            <TVMarketSelector
              onMarketSelect={(m) => {
                cb(m, 'charts');
                navigate('/binary/' + m);
                setIsOpen(false);
              }}
              className="asset-dropdown-wrapper left-[0] max-w-[300px] p-3"
            />
          </Background>
          <div id="overlay" onClick={() => setIsOpen(false)}></div>
        </>
      )}
      <ShareModal qtInfo={qtInfo} />

      <div className="flex flex-row justify-between items-center">
        <span className="text-f14 mb-2 ">Selected Pair</span>
      </div>
      <div className="px-5 py-3 rounded-[10px] y-auto bg-1  whitespace-nowrap">
        <div
          className={`flex items-center content-between assets w-full h-max`}
        >
          <div className="min-w-[30px] w-[30px] h-[30px] mr-3">
            <PairTokenImage pair={singleAsset.pair} />
          </div>
          <div className="flex-col w-full items-stretch">
            <div className="w-full flex justify-between items-center text-1">
              <button
                className={`text-f14 flex items-center bg-[#2c2c41] ${
                  !isOpen ? 'hover:brightness-125' : 'brightness-125'
                }  pl-3 rounded`}
                onClick={() => setIsOpen((prvState) => !prvState)}
              >
                {singleAsset.pair}
                <DropdownArrow open={isOpen} />
              </button>
              <span className="flex flex-row items-end justify-end ml-3">
                {currentPrice ? (
                  <Display
                    data={currentPrice}
                    precision={
                      singleAsset.price_precision.toString().length - 1
                    }
                    unit={singleAsset.token2}
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
              <div className="flex text-f12 justify-end items-center jus">
                <LastDayChange currentAsset={singleAsset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssetBackground>
  );
};

export const getActiveMarket = (
  markets: { [key: string]: MarketInterface },
  params: any
): MarketInterface => {
  let activeMaket = null;
  console.log(`ActiveAsset-markets: `, markets);
  const urlMarket = params.market.toUpperCase();
  if (urlMarket in markets) {
    activeMaket = markets[urlMarket];
  } else if (urlMarket.replace('-', '') in markets) {
    activeMaket = markets[urlMarket.replace('-', '')];
  } else {
    activeMaket = markets['BTCUSD'];
  }
  return activeMaket;
};
export const DynamicActiveAsset = ({
  markets,
  payout,
}: {
  markets: { [key: string]: MarketInterface };
  payout: string;
}) => {
  const params = useParams();
  const singleAsset = useMemo(() => {
    return getActiveMarket(markets, params);
  }, [params, markets]);
  const marketPrice = useAtomValue(priceAtom);
  const currentPrice = getPriceFromKlines(marketPrice, singleAsset);
  const [isOpen, setIsOpen] = useState(false);

  const title = currentPrice
    ? toFixed(currentPrice, singleAsset.price_precision.toString().length - 1) +
      ' | ' +
      singleAsset.tv_id
    : '';
  setDoccumentTitle(title);
  const navigate = useNavigate();
  if (!singleAsset) return null;
  return (
    <AssetBackground className="relative min-w-full border-bottom ">
      {isOpen && (
        <>
          <Background className=" !translate-x-[-20%] !translate-y-[30px]">
            <DynamicMarketSelector
              onMarketSelect={(m) => {
                cb(m, 'charts');
                navigate('/binary/' + m);
                setIsOpen(false);
              }}
              markets={Object.keys(markets).map((m) => markets[m])}
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
          <div className=" w-[20px] h-[20px] mr-[5px]">
            <PairTokenImage pair={singleAsset.pair} />
          </div>
          <div className="flex-col w-full items-stretch">
            <div className="w-full flex justify-between items-center text-3">
              <button
                className={`text-f14 flex items-center ${
                  !isOpen ? 'hover:brightness-125' : 'brightness-125'
                }  rounded`}
                onClick={() => setIsOpen((prvState) => !prvState)}
              >
                {singleAsset.pair}
                <DropdownArrow open={isOpen} />
              </button>
              <span className="flex flex-row items-end justify-end ml-3">
                {currentPrice ? (
                  <Display
                    data={currentPrice}
                    precision={
                      singleAsset.price_precision.toString().length - 1
                    }
                    unit={singleAsset.pair.split('-')[1]}
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
              <div className="flex items-center mt-1">
                <NumberTooltip content={'Payout on winning'}>
                  <div className="text-1 text-f13 cursor-pointer">
                    {/* {fullPayout ? '+' + fullPayout + '%' : 'loading...'}&nbsp;
                    {boostedPayout && boostedPayout !== '0' ? (
                      <span className="text-buffer-blue text-f12">
                        {'(' + boostedPayout + '% Boosted)'}
                      </span>
                    ) : null} */}
                  </div>
                </NumberTooltip>
              </div>
              <div className="flex text-f12 justify-end items-center jus">
                <LastDayChange currentAsset={singleAsset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssetBackground>
  );
};
export const DynamicAsset = ({
  market,
  cb,
}: {
  market: MarketInterface;
  cb: () => void;
}) => {
  const params = useParams();
  const atomValue = useAtomValue(activeAssetStateAtom);
  const { activeAssetPayout: fullPayout, boostedPayout } = atomValue;

  const singleAsset = market;
  const marketPrice = useAtomValue(priceAtom);
  const currentPrice = getPriceFromKlines(marketPrice, singleAsset);
  const [isOpen, setIsOpen] = useState(false);

  const title = currentPrice
    ? toFixed(currentPrice, singleAsset.price_precision.toString().length - 1) +
      ' | ' +
      singleAsset.tv_id
    : '';
  setDoccumentTitle(title);
  const navigate = useNavigate();
  if (!singleAsset) return null;
  return (
    <AssetBackground className="relative min-w-full border-bottom ">
      {isOpen && (
        <>
          <Background className=" !translate-x-[-20%] !translate-y-[30px]">
            <DynamicMarketSelector
              onMarketSelect={(m) => {
                cb(m, 'charts');
                navigate('/binary/' + m);
                setIsOpen(false);
              }}
              markets={Object.keys(markets).map((m) => markets[m])}
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
                  <PairTokenImage pair={singleAsset.pair} />
                </div>
                {singleAsset.pair}
                <DropdownArrow open={isOpen} />
              </button>
              <span className="flex flex-row items-end justify-end ml-3">
                {currentPrice ? (
                  <Display
                    data={currentPrice}
                    precision={
                      singleAsset.price_precision.toString().length - 1
                    }
                    unit={singleAsset.pair.split('-')[1]}
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
              <div className="flex text-f12 justify-end items-center jus">
                <LastDayChange currentAsset={singleAsset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssetBackground>
  );
};
