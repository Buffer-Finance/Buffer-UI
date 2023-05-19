import { useMediaQuery } from '@mui/material';
import { DesktopTrade } from 'src/MultiChartLayout';
import QTrade from '.';
import { useV3Config } from './V3/useV3Config';

const TradePageRoot: React.FC<any> = ({}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { data: v3Config } = useV3Config();
  console.log(v3Config, 'v3Config');

  if (isMobile) return <QTrade />;
  return <DesktopTrade />;
};
const TradePage = () => {
  return (
    <>
      <TradePageRoot />
    </>
  );
};
const NoLossTrade = () => {
  return (
    <>
      <TradePageRoot />
    </>
  );
};
export { TradePage, NoLossTrade };
