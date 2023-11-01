import styled from '@emotion/styled';

const TradeTypeChipBackground = styled.div`
  background-color: #282b39;
  color: #7f87a7;

  border-radius: 3px;
  font-size: 10px;
  font-weight: 400;
  padding: 2px 4px;
  line-height: 14px;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin-bottom: 10px;
`;

export const TradeTypeChip: React.FC<{ tradeType: string }> = ({
  tradeType,
}) => {
  return (
    <TradeTypeChipBackground>
      {' '}
      <img src="/Gear.png" className="w-[10px] h-[10px] animate-spin" />
      {tradeType}
    </TradeTypeChipBackground>
  );
};
