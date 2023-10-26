import styled from '@emotion/styled';

const TradePoolChipBackground = styled.div`
  background-color: #282b39;
  border-radius: 3px;
  padding: 1px 4px;
  width: fit-content;

  font-size: 10px;
  font-weight: 400;
  color: #ffffff;
  line-height: 14px;
`;

export const TradePoolChip: React.FC<{
  assetName: string;
  className?: string;
}> = ({ assetName, className = '' }) => {
  return (
    <TradePoolChipBackground className={className}>
      {assetName}
    </TradePoolChipBackground>
  );
};
