import { Market } from './Market';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { useFavouriteMarkets } from '@Views/ABTradePage/Hooks/useFavouriteMarkets';

export const PinnedMarkets: React.FC = () => {
  const { favouriteMarkets: markets } = useFavouriteMarkets();

  if (!markets) return <></>;
  return (
    <RowGap gap="0px">
      {markets.map((market, index) => {
        return <Market market={market} key={index} />;
      })}
    </RowGap>
  );
};
