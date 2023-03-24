import { useEffect, useMemo } from 'react';
import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Background } from './style';
import GraphView from '@Views/Common/GraphView';
import { useNavigate } from 'react-router-dom';
import Config from 'public/config.json';
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
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from './Hooks/usePastTradeQuery';
import { MarketTimingsModal } from './MarketTimingsModal';
import MobileTable from './Components/Mobile/historyTab';
import { binaryTabs } from 'config';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { useParams, useSearchParams } from 'react-router-dom';
export const mobileUpperBound = 800;
export const IV = 12000;
export const defaultPair = 'GBP-USD';
export const referralSlug = 'ref';
import { useSearchParam } from 'react-use';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Warning } from '@Views/Common/Notification/warning';
import { WarningOutlined } from '@mui/icons-material';
import { getChains } from 'src/Config/wagmiClient';
import { BuyTrade } from './BuyTrade';
import PGDesktopTables, { tradesCount } from './Tables/Desktop';
import { History } from './History';
import { TradingChart } from 'src/TradingView';
import { Markets } from 'src/Types/Market';
export interface IToken {
  address: string;
  decimals: 6;
  img: string;
  name: 'USDC' | 'BFR';
  pool_address: string;
}
export interface IPool {
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
    let activeMarket = configContracts.pairs.find((m) => {
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
      activeMarket = configContracts.pairs[0];
    }
    return {
      chain: 'ARBITRUM',
      asset: activeMarket.pair,
      pairs: configContracts.pairs.map((singlePair) => {
        return {
          ...singlePair,
          pools: singlePair.pools.map((singlePool) => {
            return {
              ...singlePool,
              token: configContracts.tokens[singlePool.token],
            };
          }),
        };
      }),
      activePair: {
        ...activeMarket,
        pools: activeMarket.pools.map((singlePool) => {
          return {
            ...singlePool,
            token: configContracts.tokens[singlePool.token],
          };
        }),
      },
      routerContract: configContracts.router,
      activeChain,
    };
  }, [params?.market, activeChain]);
  return data;
};
export const isHistoryTabActiveAtom = atomWithLocalStorage('isHistory', false);

function QTrade() {
  const props = useQTinfo();
  const params = useParams();
  const navigate = useNavigate();
  const isHistory = useAtomValue(isHistoryTabActiveAtom);
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
  // return <div>hello</div>;
  console.log(`props.activePair.tv_id: `, props.activePair.tv_id);
  return (
    <>
      <MarketTimingsModal />
      <ShareModal qtInfo={props} />
      <main className="content-drawer" id="buffer-tv-wrapper">
        <Background>
          <Favourites />
          {Object.keys(Config.markets).map((s) => {
            if (Config.markets[s].tv_id == props.activePair.tv_id) {
              return (
                <TradingChart market={Config.markets[s].tv_id as Markets} />
              );
            }
            return null;
          })}

          <BuyTrade />
        </Background>
      </main>
      <BinaryDrawer />
    </>
  );
}
export default QTrade;

export function MobileOnly({ children }: { children: JSX.Element }) {
  if (window.innerWidth > mobileUpperBound) return null;
  return <>{children}</>;
}

export function WebOnly({ children }: { children: JSX.Element }) {
  if (window.innerWidth < mobileUpperBound) return null;
  return <>{children}</>;
}

export const ActiveTable = ({ width }) => {
  const { active } = useAtomValue(tardesAtom);
  const { active: activePages } = useAtomValue(tardesTotalPageAtom);
  const totalPages = activePages;
  const filteredData = active;

  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [{ active: activePage }] = useAtom(tardesPageAtom);
  return width < mobileUpperBound ? (
    <MobileTable onPageChange={(e, pageNumber) => setActivePage(pageNumber)} />
  ) : (
    <PGDesktopTables
      currentPage={activePage}
      onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
      filteredData={filteredData}
      totalPages={totalPages}
      shouldNotDisplayShareVisulise={false}
      widths={['auto']}
    />
  );
};
export const HistoryTable = ({ width }) => {
  const { history } = useAtomValue(tardesAtom);
  const { history: historyPages } = useAtomValue(tardesTotalPageAtom);
  const totalPages = historyPages;
  const filteredData = history;

  const [, setPageNumber] = useAtom(updateHistoryPageNumber);
  const [{ history: historyPageNumber }] = useAtom(tardesPageAtom);
  return width < mobileUpperBound ? (
    <MobileTable
      isHistoryTab
      onPageChange={(e, pageNumber) => setPageNumber(pageNumber)}
    />
  ) : (
    <PGDesktopTables
      isHistoryTable
      currentPage={historyPageNumber}
      onPageChange={(e, pageNumber) => setPageNumber(pageNumber)}
      filteredData={filteredData}
      totalPages={totalPages}
      shouldNotDisplayShareVisulise={false}
      widths={['auto']}
    />
  );
};
export const CancelTable = ({ width }) => {
  const { cancelled } = useAtomValue(tardesAtom);
  const { cancelled: cancelledPages } = useAtomValue(tardesTotalPageAtom);
  const totalPages = cancelledPages;
  const filteredData = cancelled;
  const [, setCancelPageNumber] = useAtom(updateCancelledPageNumber);
  const [{ cancelled: canclledPage }] = useAtom(tardesPageAtom);
  return width < mobileUpperBound ? (
    <MobileTable
      isCancelledTab
      onPageChange={(e, pageNumber) => setCancelPageNumber(pageNumber)}
    />
  ) : (
    <PGDesktopTables
      currentPage={canclledPage}
      isCancelledTable
      onPageChange={(e, pageNumber) => setCancelPageNumber(pageNumber)}
      filteredData={filteredData}
      totalPages={totalPages}
      shouldNotDisplayShareVisulise={false}
      widths={['auto']}
    />
  );
};
