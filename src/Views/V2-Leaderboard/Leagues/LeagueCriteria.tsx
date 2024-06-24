import { capitalizeString } from '.';
import { EligibilityCriteria, getEligibilityInfo } from '../config';

const LeagueCriteria: React.FC<{ league: string }> = ({ league }) => {
  const info = getEligibilityInfo(league);
  const Card1 = info[0] ? <LeagueCriteriaCard {...info[0]} /> : null;
  const Card2 = info[1] ? <LeagueCriteriaCard {...info[1]} promo /> : null;
  return (
    <div className="flex relative w-full items-center justify-between sm:justify-evenly">
      {Card2 && <hr className="dotted-hr" />}
      {Card1}
      {Card2}
    </div>
  );
};
const LeagueCriteriaCard: React.FC<{
  league: string;
  promo?: boolean;
  criteria: number;
}> = ({ league, promo, criteria }) => {
  return (
    <div className="flex flex-col  z-10 items-center ">
      {' '}
      <div className="text-f16 text-[#808191] flex items-center gap-1 sm:gap-2 mb-[6px]">
        {promo ? 'Promotion to' : 'Required for'}{' '}
        <img
          src={`/LeaderBoard/${capitalizeString(league)}.png`}
          width={20}
          height={20}
        />
        <span className="text-[#F7F7F7] font-semibold sm:hidden">
          {capitalizeString(league)} League
        </span>
      </div>
      <div className="text-f16 text-[#fff] bg-[#232334]  rounded-[15px] p-4 text-center sm:flex-col flex">
        <span className="text-[#C3C2D4]">Min. Volume:</span>{' '}
        {criteria.toLocaleString('en-US')} USDC
      </div>
    </div>
  );
};

export { LeagueCriteria };
