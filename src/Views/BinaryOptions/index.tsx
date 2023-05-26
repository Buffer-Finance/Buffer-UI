import { useEffect } from 'react';
import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Background } from './style';
import { useNavigate } from 'react-router-dom';
// import BinaryDrawer from './PGDrawer';
import Favourites from './Favourites/Favourites';
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
import { useGenericHooks } from '@Hooks/useGenericHook';
import { useParams } from 'react-router-dom';
export const mobileUpperBound = 800;
export const IV = 12000;
export const defaultPair = 'GBP-USD';
export const referralSlug = 'ref';
import { BuyTrade } from './BuyTrade';
import PGDesktopTables from './Tables/Desktop';
import { TradingChart } from 'src/TradingView';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { useV3AppActiveMarket } from '@Views/V3App/Utils/useV3AppActiveMarket';
import { joinStrings } from '@Views/V3App/helperFns';
import { marketsForChart } from '@Views/V3App/config';
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
  user2signer: string[];
}>({
  balance: null,
  allowance: null,
  maxTrade: null,
  stats: null,
  payouts: null,
  routerPermission: null,
  user2signer: null,
});

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

export const isHistoryTabActiveAtom = atomWithLocalStorage('isHistory', false);

function QTrade() {
  const { activeMarket } = useV3AppActiveMarket();
  const marketId = joinStrings(
    activeMarket?.token0 as string,
    activeMarket?.token1 as string,
    ''
  );
  const chartMarket = marketsForChart[marketId as keyof typeof marketsForChart];
  const params = useParams();
  const navigate = useNavigate();
  const setActiveMarketFromStorage = useSetAtom(activeMarketFromStorageAtom);
  useEffect(() => {
    if (params?.market && params.market != 'undefined') {
      setActiveMarketFromStorage(params.market);
    } else {
      navigate('/#/binary/' + defaultMarket);
    }
  }, [params?.market]);

  usePastTradeQuery();
  useGenericHooks();
  useEffect(() => {
    document.title = 'Buffer | Trade';
  }, []);
  if (!activeMarket) return <></>;
  return (
    <>
      <OneCTModal />
      <MarketTimingsModal />
      <ShareModal />
      <main className="content-drawer" id="buffer-tv-wrapper">
        <Background>
          <Favourites />

          <TradingChart market={chartMarket.tv_id} />

          <BuyTrade />
        </Background>
      </main>
      {/* <BinaryDrawer /> */}
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
