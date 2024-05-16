import styled from '@emotion/styled';
import { Container } from '../Deposit/Styles';

export const HowItWorks: React.FC = () => {
  return (
    <Container>
      <div>
        <span className="text-f16 leading-[16px] font-500 text-1">
          How It Works
        </span>
        <Text>
          As a counterparty in trades, you will receive 50% of trading fees,
        </Text>
        <Text>
          uBLP is NOT principal protected. The value of uBLP may decrease
        </Text>
        <Text>
          As a counterparty in trades, you will receive 50% of trading fees,
        </Text>
      </div>
    </Container>
  );
};

const Text = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 16.14px;
  color: #7f87a7;
  margin-top: 32px;
`;
