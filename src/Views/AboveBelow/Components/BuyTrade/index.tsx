import { BuyTradeBackground } from '@Views/TradePage/Views/BuyTrade/index';
import { Buy } from './BuyButton';
import { ExpiryDate } from './ExpiryDate';
import { PayoutProfit } from './PayoutProfit';
import { PriceTable } from './PriceTable';
import { TradeSize } from './TradeSize';

export const BuyTrade = () => {
  return (
    <BuyTradeBackground>
      <ExpiryDate />
      <PriceTable />
      <TradeSize />
      <PayoutProfit amount={'0'} totalPayout={'80'} tradeToken="USDC" />
      <Buy />
    </BuyTradeBackground>
  );
};
