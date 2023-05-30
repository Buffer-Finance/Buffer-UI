import { Trans } from '@lingui/macro';
import { Settings } from './Views/Settings';

const TradePage: React.FC<any> = ({}) => {
  return (
    <div>
      <Trans>hello</Trans>
      <Settings />
    </div>
  );
};

export { TradePage };
