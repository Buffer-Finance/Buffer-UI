import styled from '@emotion/styled';

export const TradeActionButton: React.FC<{ isQueued: boolean }> = ({
  isQueued,
}) => {
  const currentPrice = 100;
  const strikePrice = 101;
  const isUp = true;
  const isProfit = currentPrice > strikePrice;

  function cancelTrade() {
    console.log('cancel');
  }

  function closeAtProfit() {
    console.log('close at profit');
  }

  function closeAtLoss() {
    console.log('close at loss');
  }

  if (isQueued) {
    return (
      <>
        <CancelButton onClick={cancelTrade}>Cancel</CancelButton>
      </>
    );
  }
  if (isProfit) {
    return (
      <>
        <CloseAtProfitButton onClick={closeAtProfit}>
          Close at profit
        </CloseAtProfitButton>
      </>
    );
  }
  return (
    <>
      <CloseAtLossButton onClick={closeAtLoss}>Close at loss</CloseAtLossButton>
    </>
  );
};

const buttonStyle = styled.button`
  font-weight: 500;
  font-size: 12px;
  width: 100%;
  border-radius: 5px;
  padding: 5px 0;
  transition: 0.2s;
  margin-top: 12px;

  :hover {
    scale: 1.05;
  }
`;

const CancelButton = styled(buttonStyle)`
  background-color: #282b39;
  color: #7f87a7;
`;

const CloseAtProfitButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #3fb68b;
`;

const CloseAtLossButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #ff5353;
`;
