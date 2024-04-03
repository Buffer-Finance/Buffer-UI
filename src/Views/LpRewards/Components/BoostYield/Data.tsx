import { BlueBtn } from '@Views/Common/V2-Button';
import { DataColumn, defaultDataStyle } from '../DataColumn';
import { Container } from '../Deposit/Styles';

export const Data = () => {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <DataColumn
          title="Total Locked"
          value={<span className={defaultDataStyle}>1,0567 USDC</span>}
        />
        <DataColumn
          title="Total Unlocked"
          value={<span className={defaultDataStyle}>67%</span>}
        />
        <DataColumn
          title="Total Claimable"
          value={<span className={defaultDataStyle}>56,661</span>}
        />
      </div>
      <BlueBtn onClick={() => {}} className="!w-fit !h-fit !px-5 !py-[0]">
        Claim
      </BlueBtn>
    </Container>
  );
};
