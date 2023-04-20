import { useMediaQuery } from '@mui/material';
import { DesktopTrade } from 'src/MultiChartLayout';
import { MobileTrade } from './MobileTrade';
import { Online, Offline } from 'react-detect-offline';
import { ReactNode } from 'react';
import Missing from '@Views/Common/Missing';
import NetworkDisconnected from '@Views/Common/Missing/NetworkDisconnected';
import QTrade from '.';

const TradePageRoot: React.FC<any> = ({}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  console.log(`isMobile: `, isMobile);

  if (isMobile) return <QTrade />;
  return <DesktopTrade />;
};
const TradePage = () => {
  return (
    <>
      {/* <Online> */}
      <TradePageRoot />
      {/* <Trade /> */}
      {/* </Online> */}
      {/* <Offline>
        <NetworkDisconnected onClick={console.log} />
      </Offline> */}
    </>
  );
};
export { TradePage };
