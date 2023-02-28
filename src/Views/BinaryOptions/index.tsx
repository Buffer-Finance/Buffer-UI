import { useEffect, useMemo } from 'react';
import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Background } from './style';
import GraphView from '@Views/Common/GraphView';
import { useNavigate } from 'react-router-dom';

import PGTables from './Tables';
import BinaryDrawer from './PGDrawer';
import { useGlobal } from '@Contexts/Global';
import { Skeleton } from '@mui/material';
import Favourites from './Favourites/Favourites';
import BufferTab from '@Views/Common/BufferTab';
import { Navbar } from './Components/Mobile/Navbar';
import { MobileScreens } from './Components/Mobile/Screens';
import { atomWithLocalStorage } from './Components/SlippageModal';
import { ShareModal } from './Components/shareModal';
import { Chain } from 'wagmi';
import {
  tardesPageAtom,
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from './Hooks/usePastTradeQuery';
import { MarketTimingsModal } from './MarketTimingsModal';
import MobileTable from './Components/Mobile/historyTab';
import { binaryTabs } from 'config';
import TVIntegrated from '../../TradingView/TV';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { useParams, useSearchParams } from 'react-router-dom';
export const mobileUpperBound = 800;
export const IV = 12000;
export const defaultPair = 'GBP-USD';
export const referralSlug = 'ref';
import Config from 'public/config.json';
import { useSearchParam } from 'react-use';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Warning } from '@Views/Common/Notification/warning';
import { WarningOutlined } from '@mui/icons-material';
import { getChains } from 'src/Config/wagmiClient';
export interface IToken {
  address: string;
  decimals: 6;
  img: string;
  name: 'USDC' | 'BFR';
  pool_address: string;
}
export interface IPool {
  payout: number;
  token: IToken;
  options_contracts: {
    current: string;
    past: string[];
    config: string;
  };
}
export interface IMarket {
  max_duration: string;
  category: 'Crypto' | 'Forex';
  tv_id: string;
  pair: string;
  price_precision: 10 | 100 | 1000 | 10000 | 100000 | 1000000;
  token1: string;
  token2: string;
  full_name: string;
  img: string;
  pools: IPool[];
}
export const referralCodeAtom = atomWithLocalStorage('referral-code5', '');
export interface IQTrade {
  activeChain?: Chain | null;
  pairs?: IMarket[];
  optionMeta?: string;
  activePair?: IMarket;
  routerContract?: string;
}
export const FavouriteAtom = atomWithLocalStorage('favourites3', []);
export const DisplayAssetsAtom = atomWithLocalStorage('displayAssetsV8', []);

export const activeAssetStateAtom = atom<{
  balance: string;
  allowance: string;
  maxTrade: string;
  stats: string;
  payouts: { [key: string]: string } | null;
  routerPermission: { [key: string]: string } | null;
}>({
  balance: null,
  allowance: null,
  maxTrade: null,
  stats: null,
  payouts: null,
  routerPermission: null,
});

export const setActiveAssetStateAtom = atom(null, (get, set, payload) => {
  set(activeAssetStateAtom, payload);
});
export const defaultMarket = 'BTC-USD';
export const ENV =
  import.meta.env.VITE_ENV.toLowerCase() === 'mainnet'
    ? 'arbitrum-main'
    : 'arbitrum-test';

export const activeMarketFromStorageAtom = atomWithLocalStorage(
  'user-active-market',
  ''
);
export const useQTinfo = () => {
  const params = useParams();
  const { activeChain, configContracts } = useActiveChain();
  const data = useMemo(() => {
    let activeMarket = Config[activeChain.id].pairs.find((m) => {
      let market = params?.market || 'ETH-USD';
      // GBP
      market = market?.toUpperCase();
      let currM = m.pair.toUpperCase();
      if (market == currM) {
        return true;
      }
      // GBP_USD

      return false;
    });
    if (!activeMarket) {
      activeMarket = Config[activeChain.id].pairs[0];
    }
    return {
      chain: 'ARBITRUM',
      asset: activeMarket.pair,
      pairs: Config[activeChain.id].pairs.map((singlePair) => {
        return {
          ...singlePair,
          pools: singlePair.pools.map((singlePool) => {
            return {
              ...singlePool,
              token: Config[activeChain.id].tokens[singlePool.token],
            };
          }),
        };
      }),
      activePair: {
        ...activeMarket,
        pools: activeMarket.pools.map((singlePool) => {
          return {
            ...singlePool,
            token: Config[activeChain.id].tokens[singlePool.token],
          };
        }),
      },
      optionMeta: configContracts.meta,
      routerContract: Config[activeChain.id].router,
      activeChain,
    };
  }, [params?.market, activeChain]);
  return data;
};

function QTrade() {
  const props = useQTinfo();
  const params = useParams();
  const navigate = useNavigate();
  const setActiveMarketFromStorage = useSetAtom(activeMarketFromStorageAtom);
  useEffect(() => {
    console.log(`params?.market: `, params?.market);
    if (params?.market && params.market != 'undefined') {
      setActiveMarketFromStorage(params.market);
    } else {
      navigate('/#/binary/' + defaultMarket);
      console.log('marketnotfound');
    }
  }, [params?.market]);
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  // const [assets, setAssets] = useAtom(DisplayAssetsAtom);
  usePastTradeQuery();
  useGenericHooks();
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const { active, history, cancelled } = useAtomValue(tardesPageAtom);

  useEffect(() => {
    document.title = 'Buffer | Trade';
  }, []);
  const AllTradeTab = {
    pathname: '/[chain]/all-trades/[asset]',
    as: `/ARBITRUM/all-trades/${defaultPair}`,
    name: 'Old Trades',
    slug: 'old-trades',
    id: 2,
    subTabs: [],
    isExternalLink: false,
  };

  useEffect(() => {
    dispatch({
      type: 'SET_ACIVE_TAB',
      payload:
        window && window.innerWidth < 1200 ? binaryTabs[0] : binaryTabs[2],
    });
  }, []);

  const tabs = binaryTabs.slice(2);
  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab) - 2,
    [state.tabs.activeIdx]
  );

  return (
    <>
      <div className="tabDispay:hidden  tab:mx-auto ">
        <div className="flex flex-col items-start max-w-[100vw] overflow-hidden">
          {props.pairs && <Favourites className="web:hidden mb-4" />}
          <Navbar
            className={
              'web:hidden mx-auto z-50 whitespace-nowrap mt-3 mb-3 b800:w-full '
            }
          />
        </div>
      </div>

      <MarketTimingsModal />
      <ShareModal qtInfo={props} />
      {/* <ComingSoonModal /> */}
      <main className="content-drawer" id="buffer-tv-wrapper">
        <Background>
          {props.pairs ? (
            <>
              {/* <Warning
                body={
                  <>
                    <WarningOutlined className="text-[#EEAA00] mt-[4px]" />{' '}
                    &nbsp; Trading on Forex & Commodities is currently halted.
                    It will be resumed shortly.
                  </>
                }
                closeWarning={() => {}}
                state={true}
                shouldAllowClose={false}
                className="!ml-1 !py-3 !px-4 !mb-3 !text-f14"
              /> */}
              {typeof window !== 'undefined' &&
                window.innerWidth < mobileUpperBound && <MobileScreens />}

              <div className="tab:hidden mb-3">
                <Favourites />
                {window.innerWidth > mobileUpperBound + 1 && (
                  <GraphView className="tab:hidden">
                    <TVIntegrated assetInfo={props.activePair} />
                  </GraphView>
                )}
              </div>
              <div className="custom-view b1200:w-[80%] mx-auto">
                <div className="tab:hidden ">
                  <div className="flex b1200:justify-center items-center nsm:ml-4">
                    <BufferTab
                      value={activeTabIdx}
                      handleChange={(e, t) => {
                        dispatch({
                          type: 'SET_ACIVE_TAB',
                          payload: binaryTabs[t + 2], //Runs only for web. Hence 0 & 1 tab neglected.
                        });
                      }}
                      distance={5}
                      tablist={tabs.map((tabName): { name: string } => ({
                        name: tabName,
                      }))}
                    />
                  </div>
                </div>
                <div className="my-3">
                  {activeTab === binaryTabs[2] && (
                    <>
                      <PGTables
                        configData={props}
                        activePage={active}
                        onPageChange={(e, pageNumber) =>
                          setActivePage(pageNumber)
                        }
                      />
                      <MobileOnly>
                        <MobileTable
                          activePage={active}
                          configData={props}
                          onPageChange={(e, pageNumber) =>
                            setActivePage(pageNumber)
                          }
                        />
                      </MobileOnly>
                    </>
                  )}
                  {activeTab === binaryTabs[3] && (
                    <>
                      <PGTables
                        configData={props}
                        activePage={history}
                        onPageChange={(e, pageNumber) =>
                          setHistoryPage(pageNumber)
                        }
                      />
                      <MobileOnly>
                        <MobileTable
                          activePage={history}
                          configData={props}
                          isHistoryTab
                          onPageChange={(e, pageNumber) =>
                            setHistoryPage(pageNumber)
                          }
                        />
                      </MobileOnly>
                    </>
                  )}
                  {activeTab === binaryTabs[4] && (
                    <>
                      <PGTables
                        configData={props}
                        activePage={cancelled}
                        onPageChange={(e, pageNumber) =>
                          setCancelledPage(pageNumber)
                        }
                      />
                      <MobileOnly>
                        <MobileTable
                          isCancelledTab
                          activePage={cancelled}
                          configData={props}
                          onPageChange={(e, pageNumber) =>
                            setCancelledPage(pageNumber)
                          }
                        />
                      </MobileOnly>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Skeleton variant="rectangular" className="stat-skel lc" />
          )}
        </Background>
      </main>
      <BinaryDrawer />
    </>
  );
}
export default QTrade;

function MobileOnly({ children }) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth > 1200 || window.innerWidth < 600) return null;
  return <>{children}</>;
}
