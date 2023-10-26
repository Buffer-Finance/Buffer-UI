import NoMatchFound from '@SVG/Elements/NoMatchFound';
import { RowGap } from '@Views/TradePage/Components/Row';
import { ToolTipSVG } from '@Views/TradePage/Components/ToolTipSVG';
import styled from '@emotion/styled';

export const NoTrades: React.FC<{ isLimitOrderTable: boolean }> = ({
  isLimitOrderTable,
}) => {
  const msg = isLimitOrderTable
    ? 'There are no pending orders'
    : 'There are no placed trades';
  return (
    <NoTradesBackground className="b1200:mb-[20vh]">
      <RowGap gap="4px">
        <ToolTipSVG />

        <span>{msg}</span>
      </RowGap>
    </NoTradesBackground>
  );
};

const NoTradesBackground = styled.div`
  background: #282b39;
  border-radius: 5px;
  padding: 6px 12px;
  font-weight: 400;
  font-size: 11px;
  color: #7f87a7;
  margin-top: 4px;
`;
