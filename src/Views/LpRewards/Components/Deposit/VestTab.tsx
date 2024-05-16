import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { poolsType } from '@Views/LpRewards/types';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

export const VestTab: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  return (
    <div>
      <TableAligner
        keyStyle={keyClasses}
        valueStyle={valueClasses}
        className="w-full"
        keysName={[
          'Staked Tokens',
          'Reserved for Vesting',
          'Vesting Status',
          'Claimable',
        ]}
        values={[
          <Display data="0" unit={activePool} className="!justify-end" />,
          <span>0.0 / 0.0</span>,
          <span> 0.0 / 0.0</span>,
          <Display data="0" unit={'BFR'} className="!justify-end" />,
        ]}
      />
      <ConnectionRequired className="mt-3">
        <div className="flex items-center gap-3 mt-3">
          <BlueBtn
            onClick={() => {}}
            className="!w-fit !py-[0] !px-3 leading-[28px]"
          >
            Deposit
          </BlueBtn>
          <BlueBtn
            onClick={() => {}}
            className="!w-fit !py-[0] !px-3 leading-[28px]"
          >
            Withdraw
          </BlueBtn>
        </div>
      </ConnectionRequired>
    </div>
  );
};
