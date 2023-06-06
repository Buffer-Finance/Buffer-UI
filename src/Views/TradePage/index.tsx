import { Trans } from '@lingui/macro';
import { MarketChart } from './Views/MarketChart';
import { AccordionTable } from './Views/AccordionTable';
import { BuyTrade } from './Views/BuyTrade';

const TradePage: React.FC<any> = ({}) => {
  return (
    <div className="flex   justify-between w-[100%]">
      <div className="flex flex-col w-full">
        <MarketChart />
        <AccordionTable />
      </div>
      <div className="h-[100%]">
        <BuyTrade />
      </div>
      {/* <Trans>hello</Trans> */}
    </div>
  );
};

export { TradePage };
