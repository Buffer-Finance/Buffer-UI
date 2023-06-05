import { Trans } from '@lingui/macro';
import { MarketChart } from './Views/MarketChart';

const TradePage: React.FC<any> = ({}) => {
  return (
    <div>
      <MarketChart />
      {/* <Trans>hello</Trans> */}
    </div>
  );
};

export { TradePage };
