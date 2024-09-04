import { BuyTradeBackground } from '@Views/ABTradePage/Views/BuyTrade/index';
import { BuyButton } from './BuyButtonAPI';
import { ExpiryDate } from './ExpiryDate';
import { PayoutProfit } from './PayoutProfit';
import { PriceFormat } from './PriceFormat';
import { PriceTable } from './PriceTable';
import { SelectedTradeData } from './SelectedTradeData';
import { TradeSize } from './TradeSize';
import { useGasPriceCheck } from '@Hooks/useGasPrice';

export const BuyTrade: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { isGasPriceHigh } = useGasPriceCheck();
  return (
    <BuyTradeBackground>
      <ExpiryDate isMobile={isMobile} />
      {/* <PriceFormat /> */}
      <PriceTable isMobile={isMobile} />
      {/* <SelectedTradeData /> */}
      <TradeSize />
      <PayoutProfit />
      {isGasPriceHigh ? (
        <div className="chip-styles-danger w-full text-[#eaeaea] mb-3">
          Trade settlements delayed due to gas spike{' '}
        </div>
      ) : null}
      <BuyButton />
    </BuyTradeBackground>
  );
};
