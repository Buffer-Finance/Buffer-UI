import { useMediaQuery } from '@mui/material';
import { DesktopTrade } from 'src/MultiChartLayout';
import QTrade from '.';

const TradePageRoot: React.FC<any> = ({}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

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
