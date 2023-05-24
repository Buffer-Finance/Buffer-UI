import { useMediaQuery } from '@mui/material';
// import { DesktopTrade } from 'src/MultiChartLayout';
import { useV3AppConfig } from './useV3AppConfig';
import { V3AppTradePageComponent } from './V3AppComponents/V3TradePage';

const V3AppTradePageRoot: React.FC<any> = ({}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const v3Config = useV3AppConfig();
  console.log(v3Config, 'v3Config');

  //   if (isMobile) return <QTrade />;
  return <V3AppTradePageComponent />;
};

const V3AppTradePage = () => {
  return (
    <>
      <V3AppTradePageRoot />
    </>
  );
};

export { V3AppTradePage };
