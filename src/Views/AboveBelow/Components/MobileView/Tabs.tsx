import { ViewOnlyInputs } from '@Views/TradePage/Components/MobileView/ViewOnlyInputs';
import { BuyButton } from '../BuyTrade/BuyButtonAPI';
import { PayoutProfit } from '../BuyTrade/PayoutProfit';
import { MarketChart } from '../MarketChart';

export const Tabs = () => {
  return (
    <>
      {/* <BuyTrade isMobile /> */}
      <MarketChart isMobile />
      <ViewOnlyInputs />
      <PayoutProfit />
      <BuyButton />
    </>
  );
};
