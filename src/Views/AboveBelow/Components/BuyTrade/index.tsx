import { BuyTradeBackground } from '@Views/ABTradePage/Views/BuyTrade/index';
import { BuyButton } from './BuyButtonAPI';
import { ExpiryDate } from './ExpiryDate';
import { PayoutProfit } from './PayoutProfit';
import { PriceFormat } from './PriceFormat';
import { PriceTable } from './PriceTable';
import { SelectedTradeData } from './SelectedTradeData';
import { TradeSize } from './TradeSize';

export const BuyTrade: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <BuyTradeBackground>
      <ExpiryDate isMobile={isMobile} />
      {/* <PriceFormat /> */}
      <PriceTable isMobile={isMobile} />
      {/* <SelectedTradeData /> */}
      <TradeSize />
      <PayoutProfit />
      <BuyButton />
    </BuyTradeBackground>
  );
};
