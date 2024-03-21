import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { divide, gte, toFixed } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import RebatesABI from '../Abis/Rebates.json';
import { useRebatesAlloted } from '../Hooks/useRebatesAlloted';
import { useRebatesClaimed } from '../Hooks/useRebatesClaimed';
import { useSeasonUserData } from '../Hooks/useSeasonUserData';
import { rebatesAddress } from '../config';

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
          <Rebates
            isCurrentWeek={selectedWeekId == currentWeekId}
            selectedWeekId={selectedWeekId}
          />
          <Competitions
            isCurrentWeek={selectedWeekId == currentWeekId}
            selectedWeekId={selectedWeekId}
          />
        </div>
      )}
    </div>
  );
};

const Rebates: React.FC<{ isCurrentWeek: boolean; selectedWeekId: number }> = ({
  isCurrentWeek,
  selectedWeekId,
}) => {
  const { isValidating, data } = useSeasonUserData(selectedWeekId);
  const { data: allotedRebates, mutate } = useRebatesAlloted();
  const selectedWeekRebate = allotedRebates?.[selectedWeekId]?.[0];
  const { address, viewOnlyMode } = useUserAccount();

  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg">
      <div className="flex flex-col gap-5">
        <Column
          head="Total Volume"
          data={<Volume data={data} isLoading={isValidating} />}
        />
        <Column
          head="Fee Paid"
          data={<Fees data={data} isLoading={isValidating} />}
        />
        <Column
          head="Volume Rebate"
          data={
            isCurrentWeek ? (
              <span className="text-f22">Calculating...</span>
            ) : (
              <Display
                data={toFixed(
                  divide(selectedWeekRebate ?? '0', 18) as string,
                  2
                )}
                unit={'ARB'}
                className="inline text-f22"
              />
            )
          }
        />
      </div>
      {address === undefined || viewOnlyMode ? (
        <span></span>
      ) : (
        !isCurrentWeek && (
          <ConnectionRequired>
            <RebateButton
              allotedRebates={allotedRebates}
              selectedWeekRebate={selectedWeekRebate}
              selectedWeekId={selectedWeekId}
              mutate={mutate}
            />
          </ConnectionRequired>
        )
      )}
    </div>
  );
};

const RebateButton: React.FC<{
  allotedRebates: { [weekId: string]: string } | undefined;
  selectedWeekRebate: string | undefined;
  selectedWeekId: number;
  mutate: () => void;
}> = ({ allotedRebates, selectedWeekRebate, selectedWeekId, mutate }) => {
  const { data: claimedRebates } = useRebatesClaimed();
  if (allotedRebates === undefined || claimedRebates === undefined) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc ml-auto" />
    );
  }
  if (selectedWeekRebate === undefined) {
    return <span></span>;
  }
  if (selectedWeekRebate === '0') {
    return <span></span>;
  }
  if (claimedRebates.some((r) => r.weekId === selectedWeekId.toString())) {
    return (
      <BlueBtn
        onClick={() => {}}
        isDisabled
        className="!w-fit h-fit px-[14px] py-[1px] mb-2 min-h-[26px]"
      >
        Claimed
      </BlueBtn>
    );
  }

  return <ClaimRebate selectedWeekId={selectedWeekId} mutate={mutate} />;
};

const ClaimRebate: React.FC<{ selectedWeekId: number; mutate: () => void }> = ({
  selectedWeekId,
  mutate,
}) => {
  const { writeCall } = useWriteCall(rebatesAddress, RebatesABI);
  const [isLoading, setIsLoading] = useState(false);
  const toastify = useToast();
  return (
    <BlueBtn
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={async () => {
        try {
          setIsLoading(true);
          await writeCall(
            (p) => {
              console.log(p);
            },
            'claimRebate',
            [selectedWeekId]
          );
          //call after 5seconds
          setTimeout(() => {
            mutate();
          }, 5000);
          setIsLoading(false);
        } catch (e) {
          toastify({
            type: (e as Error).message,
            msg: 'Error while claiming rebate',
            id: 'rebate-claim-error',
          });
        }
      }}
      className="!w-fit h-fit px-[14px] py-[1px] mb-2 !min-h-[26px]"
    >
      Claim
    </BlueBtn>
  );
};

const Volume: React.FC<{
  data:
    | {
        USDCVolume: string;
        ARBVolume: string;
        BFRVolume: string;
        totalVolume: string;
      }
    | undefined;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  } else if (data === undefined) {
    return <span className="text-f22">0 USDC</span>;
  }
  return (
    <Display
      content={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['USDCVolume', 'ARBVolume', 'BFRVolume']}
          values={[
            toFixed(divide(data.USDCVolume, 6) as string, 2) + ' USDC',
            toFixed(divide(data.ARBVolume, 18) as string, 2) + ' ARB',
            toFixed(divide(data.BFRVolume, 18) as string, 2) + ' BFR',
          ]}
        />
      }
      data={toFixed(divide(data.totalVolume, 6) as string, 2)}
      label={'$'}
      className="inline text-f22"
    />
  );
};

const Fees: React.FC<{
  data:
    | {
        USDCFee: string;
        ARBFee: string;
        BFRFee: string;
        totalFee: string;
      }
    | undefined;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  } else if (data === undefined) {
    return <span className="text-f22">0 USDC</span>;
  }
  return (
    <Display
      content={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['USDCFee', 'ARBFee', 'BFRFee']}
          values={[
            toFixed(divide(data.USDCFee, 6) as string, 2) + ' USDC',
            toFixed(divide(data.ARBFee, 18) as string, 2) + ' ARB',
            toFixed(divide(data.BFRFee, 18) as string, 2) + ' BFR',
          ]}
        />
      }
      data={toFixed(divide(data.totalFee, 6) as string, 2)}
      label={'$'}
      className="inline text-f22"
    />
  );
};

const Competitions: React.FC<{
  isCurrentWeek: boolean;
  selectedWeekId: number;
}> = ({ isCurrentWeek, selectedWeekId }) => {
  const { isValidating, data } = useSeasonUserData(selectedWeekId);
  const { address, viewOnlyMode } = useUserAccount();

  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg">
      <div className="flex flex-col gap-5">
        <Column
          head="PnL"
          data={<PnL data={data} isLoading={isValidating} />}
        />
        <Column head="Rank" data={<span className="text-f22">2</span>} />
        <Column
          head="Competition Rewards"
          data={
            <Display data={234234} unit={'ARB'} className="inline text-f22" />
          }
        />
      </div>
      {address === undefined || viewOnlyMode ? (
        <span></span>
      ) : (
        !isCurrentWeek && (
          <BlueBtn
            onClick={() => {}}
            className="!w-fit h-fit px-[14px] py-[1px] mb-2"
          >
            Claim
          </BlueBtn>
        )
      )}
    </div>
  );
};

const PnL: React.FC<{
  data:
    | {
        USDCPnl: string;
        ARBPnl: string;
        BFRPnl: string;
        totalPnl: string;
      }
    | undefined;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  } else if (data === undefined) {
    return <span className="text-f22">0 USDC</span>;
  }
  return (
    <Display
      content={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['USDCPnL', 'ARBPnL', 'BFRPnL']}
          values={[
            toFixed(divide(data.USDCPnl, 6) as string, 2) + ' USDC',
            toFixed(divide(data.ARBPnl, 18) as string, 2) + ' ARB',
            toFixed(divide(data.BFRPnl, 18) as string, 2) + ' BFR',
          ]}
        />
      }
      data={toFixed(divide(data.totalPnl, 6) as string, 2)}
      label={'$'}
      className={`inline text-f22 ${
        gte(data.totalPnl, '0') ? 'text-green' : 'text-red'
      }`}
    />
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
