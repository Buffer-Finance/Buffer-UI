import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';

export const UserRewards: React.FC<{
  selectedWeekId: number;
  currentWeekId: number;
}> = ({ selectedWeekId, currentWeekId }) => {
  return (
    <div className="mt-7">
      <div className="text-[#F7F7F7] text-[20px] font-medium">Your Rewards</div>
      <div className="text-f16 font-medium text-[#7F87A7] mb-4">
        Claim your rewards for trading on Buffer
      </div>
      {currentWeekId < selectedWeekId ? (
        <div className="w-[300px] bg-[#141823] px-[18px] py-6 rounded-lg text-[#7F87A7] text-f16">
          Not Started Yet.
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          <Rebates isCurrentWeek={selectedWeekId == currentWeekId} />
          <Competitions isCurrentWeek={selectedWeekId == currentWeekId} />
        </div>
      )}
    </div>
  );
};

const Rebates: React.FC<{ isCurrentWeek: boolean }> = ({ isCurrentWeek }) => {
  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg">
      <div className="flex flex-col gap-5">
        <Column
          head="Total Volume"
          data={<Display data={234} label={'$'} className="inline text-f22" />}
        />
        <Column
          head="Fee Paid"
          data={<Display data={234} label={'$'} className="inline text-f22" />}
        />
        <Column
          head="Volume Rebate"
          data={
            <Display data={234234} unit={'ARB'} className="inline text-f22" />
          }
        />
      </div>
      {!isCurrentWeek && (
        <BlueBtn
          onClick={() => {}}
          className="!w-fit h-fit px-[14px] py-[1px] mb-2"
        >
          Claim
        </BlueBtn>
      )}
    </div>
  );
};

const Competitions: React.FC<{ isCurrentWeek: boolean }> = ({
  isCurrentWeek,
}) => {
  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg">
      <div className="flex flex-col gap-5">
        <Column
          head="PnL"
          data={
            <Display data={234} label={'$'} className="inline text-f22 green" />
          }
        />
        <Column
          head="Rank"
          data={<Display data={2} className="inline text-f22" />}
        />
        <Column
          head="Competition Rewards"
          data={
            <Display data={234234} unit={'ARB'} className="inline text-f22" />
          }
        />
      </div>
      {!isCurrentWeek && (
        <BlueBtn
          onClick={() => {}}
          className="!w-fit h-fit px-[14px] py-[1px] mb-2"
        >
          Claim
        </BlueBtn>
      )}
    </div>
  );
};

const Column: React.FC<{ head: string; data: React.ReactElement }> = ({
  data,
  head,
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-[#7F87A7] text-f16 font-medium">{head}</span>
      {data}
    </div>
  );
};
