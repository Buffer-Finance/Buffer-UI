import styled from '@emotion/styled';

export const StatsContainer = styled.div`
  background-color: #141823;
  width: 280px;
  padding: 28px 42px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  line-height: 25px;
  border-radius: 12px;

  @media only screen and (max-width: 600px) {
    max-width: 100%;
    width: 100%;
  }
`;
