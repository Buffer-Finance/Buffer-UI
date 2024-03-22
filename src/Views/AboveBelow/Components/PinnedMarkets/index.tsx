import {
  aboveBelowMarketsAtom,
  favouriteMarketsAtom,
} from '@Views/AboveBelow/atoms';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useAtomValue } from 'jotai';
import { Market } from './Market';

export const PinnedMarkets = () => {
  const favouriteMarkets = useAtomValue(favouriteMarketsAtom);
  const allMarkets = useAtomValue(aboveBelowMarketsAtom);
  if (!allMarkets) return <></>;
  return (
    <RowGap gap="0px">
      {favouriteMarkets.map((marketId) => {
        const marketData = allMarkets.find(
          (market) => market.tv_id === marketId
        );
        return <Market market={marketData!} key={marketId} />;
      })}
    </RowGap>
  );
};
