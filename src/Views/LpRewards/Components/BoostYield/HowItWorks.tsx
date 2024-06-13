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
          Earn ARB incentives on your LP position by locking in the yield boost
          vault.
        </Text>
        <Text>
          Boost will be linearly calculated proportionally to the chosen
          duration (min - 7 days, max - 90 days) of the lock and the maximum
          lock multiplier<span className=" font-bold">(2x)</span>.
        </Text>
        <Text>
          Allocation of the incentives are based on weekly epochs. Every epoch,
          a set number of ARB will be allocated for boosts. Accrued ARB
          incentives can be claimed at anytime.
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
