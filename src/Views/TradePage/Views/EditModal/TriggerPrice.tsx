import { RowBetween } from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';

export const TriggerPrice: React.FC<{
  price: number;
  setPrice: (newPrice: number) => void;
}> = ({ price, setPrice }) => {
  return (
    <RowBetween>
      <BuyTradeHeadText>Trigger price</BuyTradeHeadText>
      <input
        value={price}
        type="number"
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border-none bg-[#282b39] text-f14 px-2 outline-none text-center text-1 rounded-sm w-[85px]"
      />
    </RowBetween>
  );
};
