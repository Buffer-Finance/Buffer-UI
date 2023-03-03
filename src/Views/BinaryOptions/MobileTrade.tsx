import { Skeleton } from '@mui/material';
import TVIntegrated from '@TV/TV';
import { useQTinfo } from '.';
import { BuyTrade } from './BuyTrade';
import Favourites from './Favourites/Favourites';

const MobileTrade: React.FC<any> = ({}) => {
  const props = useQTinfo();
  return (
    <main>
      {props.pairs ? (
        <>
          <Favourites />
          <TVIntegrated assetInfo={props.activePair} />
          <BuyTrade />
        </>
      ) : (
        <Skeleton variant="rectangular" className="stat-skel lc" />
      )}
    </main>
  );
};

export { MobileTrade };
