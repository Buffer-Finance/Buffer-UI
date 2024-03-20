import { Display } from '@Views/Common/Tooltips/Display';

export const Summary = () => {
  return (
    <div className="mt-7">
      <div className="text-f20 text-[#F7F7F7] font-medium mb-6">
        Rewards Summary
      </div>
      <div className="flex gap-[60px] items-start">
        <TradingRewards />
        <ComeptitionRewards />
      </div>
    </div>
  );
};

const TradingRewards: React.FC = () => {
  return (
    <div>
      <div className="text-[#FFFFFF] text-f16 font-medium mb-6">
        Trading Rewards
      </div>
      <div className="flex gap-6 items-start">
        <Column
          head="Rebates Claimed"
          data={
            <Display
              data={0}
              label={'$'}
              className="text-[#FFFFFF] text-f22 font-medium !text-start"
            />
          }
        />
        <Divider />
        <Column
          head="Rebates Unclaimed"
          data={
            <Display
              data={0}
              label={'$'}
              className="text-[#FFFFFF] text-f22 font-medium !text-start"
            />
          }
        />
      </div>
    </div>
  );
};

const ComeptitionRewards: React.FC = () => {
  return (
    <div className="h-fit">
      <div className="text-[#FFFFFF] text-f16 font-medium mb-6">
        Trading Rewards
      </div>
      <div className="flex gap-6 items-start h-full">
        <Column
          head="Rebates Claimed"
          data={
            <Display
              data={0}
              label={'$'}
              className="text-[#FFFFFF] text-f22 font-medium !text-start"
            />
          }
        />
        <Divider />
        <Column
          head="Rebates Unclaimed"
          data={
            <Display
              data={0}
              label={'$'}
              className="text-[#FFFFFF] text-f22 font-medium !text-start"
            />
          }
        />
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="h-[40px] w-[2px] bg-[#393953] mt-3" />;
};

const Column: React.FC<{ head: string; data: React.ReactNode }> = ({
  data,
  head,
}) => {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="text-[#7F87A7] text-f16 font-medium">{head}</div>
      {data}
    </div>
  );
};
