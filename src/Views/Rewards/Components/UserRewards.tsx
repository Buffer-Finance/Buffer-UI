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
import { useMemo, useState } from 'react';
import { getAddress } from 'viem';
import CompetitionRewardABI from '../Abis/CompetitionReward.json';
import RebatesABI from '../Abis/Rebates.json';
import { useCompetitionRewardsAlloted } from '../Hooks/useCompetitionRewardsAlloted';
import { useCompetitionRewardsClaimed } from '../Hooks/useCompetitionRewardsClaimed';
import { useRebatesAlloted } from '../Hooks/useRebatesAlloted';
import { useRebatesClaimed } from '../Hooks/useRebatesClaimed';
import { useSeasonUserData } from '../Hooks/useSeasonUserData';
import { useWeeklyParticipentsData } from '../Hooks/useWeeklyParticipentsData';
import { competitionRewardAddress, rebatesAddress } from '../config';

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
        <ConnectionRequired className="max-w-[200px]">
          <div className="flex gap-5 items-start sm:flex-col">
            <Rebates
              isCurrentWeek={selectedWeekId == currentWeekId}
              selectedWeekId={selectedWeekId}
            />
            <Competitions
              isCurrentWeek={selectedWeekId == currentWeekId}
              selectedWeekId={selectedWeekId}
            />
          </div>
        </ConnectionRequired>
      )}
    </div>
  );
};

const Rebates: React.FC<{ isCurrentWeek: boolean; selectedWeekId: number }> = ({
  isCurrentWeek,
  selectedWeekId,
}) => {
  const { isValidating, data } = useSeasonUserData(selectedWeekId);
  const { data: allotedRebates } = useRebatesAlloted();
  const selectedWeekRebate = allotedRebates?.[selectedWeekId]?.[0];
  const { address, viewOnlyMode } = useUserAccount();

  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg sm:w-full">
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
              <span className="text-f22">Ongoing...</span>
            ) : allotedRebates === undefined ? (
              <Skeleton
                variant="rectangular"
                className="w-[80px] !h-7 lc mr-auto"
              />
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
}> = ({ allotedRebates, selectedWeekRebate, selectedWeekId }) => {
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

  return <ClaimRebate selectedWeekId={selectedWeekId} />;
};

const ClaimRebate: React.FC<{ selectedWeekId: number }> = ({
  selectedWeekId,
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
        } catch (e) {
          toastify({
            type: (e as Error).message,
            msg: 'Error while claiming rebate',
            id: 'rebate-claim-error',
          });
        } finally {
          setIsLoading(false);
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
  const { data: rewardsAlloted } = useCompetitionRewardsAlloted();

  const selectedWeekAlloted = useMemo(() => {
    if (rewardsAlloted === undefined) {
      return undefined;
    }
    return rewardsAlloted.find((r) => r.weekId == selectedWeekId);
  }, [rewardsAlloted, selectedWeekId]);

  const selectedWeekAllotedAMount = selectedWeekAlloted?.amount;
  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg sm:w-full">
      <div className="flex flex-col gap-5">
        <Column
          head="PnL"
          data={<PnL data={data} isLoading={isValidating} />}
        />
        <Column
          head="Rank"
          data={<RankWrapper selectedWeekId={selectedWeekId} />}
        />
        <Column
          head="Competition Rewards"
          data={
            isCurrentWeek ? (
              <span className="text-f22">Ongoing...</span>
            ) : isValidating ? (
              <Skeleton
                variant="rectangular"
                className="w-[80px] !h-7 lc mr-auto"
              />
            ) : (
              <Display
                data={toFixed(
                  divide(selectedWeekAllotedAMount ?? '0', 18) as string,
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
          <CompetitionRewardsButton
            allotedRewards={selectedWeekAlloted}
            selectedWeekRebate={selectedWeekAllotedAMount}
          />
        )
      )}
    </div>
  );
};

const CompetitionRewardsButton: React.FC<{
  selectedWeekRebate: string | undefined;
  allotedRewards:
    | {
        id: number;
        weekId: number;
        address: string;
        contract: string;
        token: string;
        amount: string;
        reward_id: string;
        signature: string;
        note: string;
        created_at: string;
        updated_at: string;
        time_threshold: number;
      }
    | undefined;
}> = ({ allotedRewards, selectedWeekRebate }) => {
  const { data: claimedRewards } = useCompetitionRewardsClaimed();
  if (allotedRewards === undefined || claimedRewards === undefined) {
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
  if (claimedRewards.some((r) => r.reward_id === allotedRewards.reward_id)) {
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
  return <ClaimCompetitionReward allotedRewards={allotedRewards} />;
};

const ClaimCompetitionReward: React.FC<{
  allotedRewards: {
    id: number;
    weekId: number;
    address: string;
    contract: string;
    token: string;
    amount: string;
    reward_id: string;
    signature: string;
    note: string;
    created_at: string;
    updated_at: string;
    time_threshold: number;
  };
}> = ({ allotedRewards }) => {
  const { writeCall } = useWriteCall(
    competitionRewardAddress,
    CompetitionRewardABI
  );
  const [isLoading, setIsLoading] = useState(false);
  const toastify = useToast();
  const params = [
    allotedRewards.address,
    allotedRewards.token,
    allotedRewards.amount,
    allotedRewards.reward_id,
    allotedRewards.time_threshold,
    allotedRewards.signature,
  ];
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
            'claimMultiple',
            [[params]]
          );

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

const RankWrapper: React.FC<{ selectedWeekId: number }> = ({
  selectedWeekId,
}) => {
  const { address } = useUserAccount();
  const { data, isValidating } = useSeasonUserData(selectedWeekId);
  if (address === undefined) {
    return <span className="text-f22">-</span>;
  }
  if (isValidating) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  }
  if (data === undefined) {
    return <span className="text-f22">-</span>;
  }
  return (
    <Rank
      selectedWeekId={selectedWeekId}
      totalPnl={data.totalPnl}
      userAddress={address}
    />
  );
};

const Rank: React.FC<{
  selectedWeekId: number;
  totalPnl: string;
  userAddress: string;
}> = ({ selectedWeekId, totalPnl, userAddress }) => {
  const { isValidating, data } = useWeeklyParticipentsData(
    selectedWeekId,
    totalPnl
  );

  const userRank = useMemo(() => {
    if (data === undefined) return '-';
    let rank = 0;
    if (data.weeklyLeaderboards.length > 0) {
      rank = data.weeklyLeaderboards.length + 1;
    }
    if (data.samePnl.length > 1) {
      const userIndex = data.samePnl.findIndex(
        (participant) =>
          getAddress(participant.userAddress) === getAddress(userAddress)
      );
      if (userIndex > 0) {
        rank += userIndex;
      }
    }
    return rank.toString();
  }, [data]);
  if (isValidating) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  }
  return <span className="text-f22">{userRank}</span>;
};
