import { useMediaQuery } from '@mui/material';
import { DesktopTrade } from 'src/Test';
import { MobileTrade } from './MobileTrade';

const TradePage: React.FC<any> = ({}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  console.log(`isMobile: `, isMobile);
  if (isMobile) return <MobileTrade />;
  return <DesktopTrade />;
};

export { TradePage };
