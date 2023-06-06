import { Market } from './Market';
import { RowGap } from '@Views/TradePage/Components/Row';
import { usePinnedAssets } from '@Views/TradePage/Hooks/usePinnedAssets';

export const PinnedMarkets: React.FC = () => {
  const markets = usePinnedAssets();

  if (!markets) return <></>;
  return (
    <RowGap gap="0px">
      {markets.map((market) => {
        return <Market market={market} key={market.token0 + market.token1} />;
      })}
    </RowGap>
  );
};
