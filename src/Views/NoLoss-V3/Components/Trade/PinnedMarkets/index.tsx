import {
  noLossFavouriteMarketsAtom,
  nolossmarketsAtom,
} from '@Views/NoLoss-V3/atoms';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useAtomValue } from 'jotai';
import { Market } from './Market';

export const PinnedMarkets = () => {
  const favouriteMarkets = useAtomValue(noLossFavouriteMarketsAtom);
  const allMarkets = useAtomValue(nolossmarketsAtom);
  if (!allMarkets) return <></>;
  return (
    <RowGap gap="0px">
      {favouriteMarkets.map((marketId) => {
        const marketData = allMarkets.find(
          (market) => market.chartData.tv_id === marketId
        );
        return <Market market={marketData!} key={marketId} />;
      })}
    </RowGap>
  );
};
