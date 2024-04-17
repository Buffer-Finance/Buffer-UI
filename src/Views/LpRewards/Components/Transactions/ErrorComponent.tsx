import { transactionTabType } from '@Views/LpRewards/types';
import styled from '@emotion/styled';

export const ErrorComponent: React.FC<{
  activeTab: transactionTabType;
  isDataAvailable: boolean;
  isError: boolean;
}> = ({ activeTab, isDataAvailable, isError }) => {
  if (isError) {
    return <ErrorDiv>Something went wring.Try again later.</ErrorDiv>;
  }
  if (isDataAvailable) {
    if (activeTab === 'my') {
      return <ErrorDiv>Wallet Not Connected.</ErrorDiv>;
    } else {
      return <ErrorDiv>No txns found.</ErrorDiv>;
    }
  }
  return <ErrorDiv>Fetching data...</ErrorDiv>;
};

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 0;
  font-size: 16px;
  color: #ffffff;
`;
