import { RowBetween } from '@Views/ABTradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/ABTradePage/Components/TextWrapper';

export const TriggerPrice: React.FC<{
  price: string;
  setPrice: (newPrice: string) => void;
}> = ({ price, setPrice }) => {
  return (
    <RowBetween className=" gap-x-3">
      <BuyTradeHeadText>Trigger price</BuyTradeHeadText>
      <input
        value={price}
        type="number"
        onChange={(e) => setPrice(e.target.value)}
        className="!w-[80px] ml-[80px] text-right border-none bg-[#282b39] text-f14 px-2 outline-none  text-1 rounded-sm "
      />
    </RowBetween>
  );
};
export const LimitOrderTradeSize: React.FC<{
  size: string;
  setSize: (newSize: string) => void;
}> = ({ size, setSize }) => {
  return (
    <RowBetween className=" gap-x-3">
      <BuyTradeHeadText>Trade Size</BuyTradeHeadText>
      <input
        value={size}
        type="number"
        onChange={(e) => setSize(e.target.value)}
        className="!w-full  text-right border-none bg-[#282b39] text-f14 px-2 outline-none  text-1 rounded-sm "
      />
    </RowBetween>
  );
};
