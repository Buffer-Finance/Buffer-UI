import { ViewOnlyInputs } from '@Views/TradePage/Components/MobileView/ViewOnlyInputs';
import { Buy } from '../BuyTrade/BuyButton';
import { PayoutProfit } from '../BuyTrade/PayoutProfit';
import { MarketChart } from '../MarketChart';

export const Tabs = () => {
  return (
    <>
      {/* <BuyTrade isMobile /> */}
      <MarketChart isMobile />
      <ViewOnlyInputs />
      <PayoutProfit />
      <Buy />
    </>
  );
};
