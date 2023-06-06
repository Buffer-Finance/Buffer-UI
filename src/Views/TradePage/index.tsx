import { Trans } from '@lingui/macro';
import { MarketChart } from './Views/MarketChart';
import { AccordionTable } from './Views/AccordionTable';

const TradePage: React.FC<any> = ({}) => {
  return (
    <div className="flex   justify-between w-[100%]">
      <div className="flex flex-col w-full">
        <MarketChart />
        <AccordionTable />
      </div>
      <div className="w-[300px] bg-red h-[100%]"></div>
      {/* <Trans>hello</Trans> */}
    </div>
  );
};

export { TradePage };
