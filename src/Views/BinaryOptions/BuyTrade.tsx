import { usePrice } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom, useAtomValue } from 'jotai';
import { ReactNode, useEffect } from 'react';
import {
  AmountSelector,
  DurationSelector,
  SettingsSelector,
} from './AmountSelector';
import { knowTillAtom } from '../TradePage/Hooks/useIsMerketOpen';
import { ammountAtom, approveModalAtom } from './PGDrawer';

const BuyTrade: React.FC<any> = ({}) => {
  const [amount, setAmount] = useAtom(ammountAtom);
  const { address: account } = useUserAccount();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);

  useEffect(() => {
    if (isApproveModalOpen && account) {
      setIsApproveModalOpen(false);
    }
  }, [account]);

  usePrice(true);
  const knowTill = useAtomValue(knowTillAtom);
  // const { activeMarket } = useV3AppActiveMarket();

  // if (!activeMarket)
  //   return null;
  // const isForex = activeMarket.category === AssetCategory[0];

  let MarketOpenWarning: ReactNode | null = null;
  // if (isForex && knowTill === false) {
  //   MarketOpenWarning = <MarketTimingWarning />;
  // }
  return (
    <div>
      <div className="flex gap-3 my-3">
        <AmountSelector amount={amount} setAmount={setAmount} />
        <DurationSelector />
        <SettingsSelector />
      </div>
      {/* <PayoutProfit
        amount={amount}
        boostedPayout={boostedPayout}
        totalPayout={totalPayout}
        tradeToken={tradeToken}
      />
      <TradeButton
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={amount}
        isAssetActive={!switchPool.isPaused}
        isForex={isForex}
        isMarketOpen={isMarketOpen}
      /> */}
      {MarketOpenWarning}
    </div>
  );
};

export { BuyTrade };
