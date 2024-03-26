import styled from '@emotion/styled';

const TradeTypeChipBackground = styled.div`
  background-color: #282b39;
  color: #7f87a7;
  width: fit-content;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 400;
  padding: 2px 4px;
  line-height: 14px;
  text-transform: capitalize;
  margin-bottom: 4px;
`;

export const TradeTypeChip: React.FC<{ tradeType: string }> = ({
  tradeType,
}) => {
  return <TradeTypeChipBackground>{tradeType}</TradeTypeChipBackground>;
};
