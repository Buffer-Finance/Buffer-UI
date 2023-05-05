import { AddTokenToMetamask } from '@Views/Common/AddTokenToMetamask';
import { Section } from '@Views/Earn/Components/Section';
import { getContract } from '../Config/Addresses';
import { useLBFRGraphql } from '../Hooks/useGraphql';
import { useLBFRreadCalls } from '../Hooks/useReadCalls';
import { useActiveChain } from '@Hooks/useActiveChain';
import { LBFRconfig } from '../config';
import { getDistance } from '@Utils/Time';
import { ClaimCard } from './ClaimCard';
import { StakeCard } from './StakeCard';

export const Cards = () => {
  const graphData = useLBFRGraphql();
  const readcallData = useLBFRreadCalls();
  const { activeChain } = useActiveChain();
  const launchTimeStamp = LBFRconfig[activeChain.id]?.startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);

  if (!launchTimeStamp) return <></>;
  if (distance > 0) return <></>;

  return (
    <Section
      Heading={
        <div className="text-f22 flex items-center gap-3">
          <span>Loyalty Program</span>
          <AddTokenToMetamask
            tokenAddress={getContract(activeChain.id, 'LBFR')}
            tokenDecimals={18}
            tokenImage=""
            tokenSymbol="LBFR"
          />
        </div>
      }
      subHeading={<></>}
      Cards={[
        <ClaimCard data={graphData} />,
        <StakeCard data={readcallData} />,
      ]}
      className="!mt-7"
    />
  );
};
