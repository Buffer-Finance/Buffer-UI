import { useActiveChain } from '@Hooks/useActiveChain';
import { usePriceRetriable } from '@Hooks/usePrice';
import { MobileWarning, RightPanelBackground } from '@Views/ABTradePage';
import {
  miscsSettingsAtom,
  tradePanelPositionSettingsAtom,
} from '@Views/ABTradePage/atoms';
import { tradePanelPosition } from '@Views/ABTradePage/type';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { polygon, polygonMumbai } from 'viem/chains';
import { BuyTrade } from './Components/BuyTrade';
import { MarketChart } from './Components/MarketChart';
import { MarketPicker } from './Components/MobileView/MarketPicker';
import { Shutters } from './Components/MobileView/Shutters';
import { Tabs } from './Components/MobileView/Tabs';
import { PinnedMarkets } from './Components/PinnedMarkets';
import { StatusBar } from './Components/StatusBar';
import { Tables } from './Components/Tables';
import { useAboveBelowMarketsSetter } from './Hooks/useAboveBelowMarketsSetter';
import { useActiveMarketSetter } from './Hooks/useActiveMarketSetter';
import { usePastTradeQuery } from './Hooks/usePastTradeQuery';
import { useReacallDataSetter } from './Hooks/useReadcallDataSetter';
import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  setSelectedPoolForTradeAtom,
} from './atoms';
import { AccordionTable } from '@Views/ABTradePage/Views/AccordionTable';
import { useLimitedStrikeArrays } from './Hooks/useLimitedStrikeArrays';
import { ShareModal } from '@Views/ABTradePage/Views/AccordionTable/ShareModal';
import { useJackpotManager } from 'src/atoms/JackpotState';
import { Sidebar } from '@Views/Common/SidebarAB';
const demoOption = {
  id: 179,
  signature_timestamp: 1711626558,
  queued_timestamp: 1711626560,
  queue_id: 179,
  strike: 6900000000000,
  target_contract: '0x200073FfA24625e003ECd84f04518D08Bb5345b7',
  user_signature:
    '0xb385db5477972d30bd1eb8ace7cba6e082bb601c95d77c273ca695f1e05df39542e3c663c1d3baf8468ba5f17c1d4e585beb3e5f2ca6e82187888fa8de86f71d1b',
  user_address: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
  trade_size: '199999999999999999999',
  allow_partial_fill: true,
  referral_code: '',
  trader_nft_id: null,
  expiration_time: 1711699200,
  is_above: true,
  state: 'OPENED',
  option_id: 15,
  environment: '421614',
  expiry_price: null,
  payout: null,
  close_time: null,
  locked_amount: '227350569621118688535',
  is_cancelled: false,
  cancellation_reason: null,
  cancellation_timestamp: null,
  open_timestamp: 1711626560,
  token: 'ARB',
  router: '0x7730133488D1FB3b705FB8eDffb6630cF616777B',
  contracts: null,
  total_fee: '200000000000000000000',
  maxFeePerContract: '882896957832310100',
  jackpot_amount: null,
  jackpot_txn_hash: null,
  pending_operation: null,
};
export const AboveBelow = () => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  const { activeChain } = useActiveChain();
  usePriceRetriable();
  useAboveBelowMarketsSetter();
  useActiveMarketSetter();
  useLimitedStrikeArrays();
  useReacallDataSetter();
  usePastTradeQuery();
  const setActivePoolMarket = useSetAtom(setSelectedPoolForTradeAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  const jackpotManager = useJackpotManager();
  const isNotMobile = useMedia('(min-width:1200px)');

  const addJackpot = () => {
    jackpotManager.addJackpot({
      option_id: demoOption.option_id,
      target_contract: demoOption.target_contract,
      jackpot_amount: demoOption.jackpot_amount || '22000000000000000000',
      router: demoOption.router,
      user_address: demoOption.user_address,
      trade_size: demoOption.total_fee,
    });
  };
  useEffect(() => {
    if (markets.length > 0) {
      if (!selectedPoolMarket) {
        setActivePoolMarket(markets[0].poolInfo.token.toUpperCase());
      }
    }
  }, [markets.length]);

  if ([polygon.id, polygonMumbai.id].includes(activeChain.id as 80001)) {
    return <MobileWarning />;
  }
  if (isNotMobile)
    return (
      <>
        <Sidebar />

        <div
          className={`flex h-full justify-between w-[100%] bg-[#1C1C28] ${
            panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
          }`}
        >
          {/* <button onClick={addJackpot}>dddAdd</button> */}
          <>
            <ShareModal />
            <RightPanelBackground>
              {showFavoriteAsset && <PinnedMarkets />}
              <StatusBar isMobile={false} />
              <MarketChart isMobile={false} />
              {/* <Tables /> */}
              <AccordionTable />
            </RightPanelBackground>
            <BuyTrade isMobile={false} />
          </>
        </div>
      </>
    );
  else {
    return (
      <div className="px-3">
        <Shutters />
        <MarketPicker />
        <Tabs />
      </div>
    );
  }
};

export default AboveBelow;
