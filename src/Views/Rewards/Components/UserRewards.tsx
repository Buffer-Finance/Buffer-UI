import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { add, divide, gte, toFixed } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { toFixed as ntoFixed } from '@Utils/NumString';

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
import {
  ILeaderboardQuery,
  useDailyLeaderboardData,
} from '@Views/V2-Leaderboard/Incentivised/useDailyLeaderBoardData';

export const UserRewards: React.FC<{
  selectedWeekId: number;
  currentWeekId: number;
}> = ({ selectedWeekId, currentWeekId }) => {
  const leagueData = useDailyLeaderboardData('Bronze');

  return (
    <div className="mt-7">
      <div className="text-[#d4d2d2] text-[20px] font-medium">Your Rewards</div>
      <div className="text-f16 font-medium text-[#7F87A7] mb-4">
        Claim your rewards for trading on Buffer
      </div>
      {currentWeekId < selectedWeekId ? (
        <div className="w-[300px] bg-[#141823] px-[18px] py-6 rounded-lg text-[#7F87A7] text-f16">
          Not Started Yet.
        </div>
      ) : leagueData?.data == undefined || leagueData == null ? (
        <div>Loading...</div>
      ) : (
        <ConnectionRequired className="max-w-[200px]">
          <div className="flex gap-5 items-start sm:flex-col">
            {/* <Rebates
              isCurrentWeek={selectedWeekId == currentWeekId}
              selectedWeekId={selectedWeekId}
            /> */}
            <Competitions
              leagueData={leagueData.data}
              isCurrentWeek={selectedWeekId == currentWeekId}
              selectedWeekId={selectedWeekId}
            />
          </div>
        </ConnectionRequired>
      )}
    </div>
  );
};

const Competitions: React.FC<{
  isCurrentWeek: boolean;
  leagueData: ILeaderboardQuery;
  selectedWeekId: number;
}> = ({ isCurrentWeek, selectedWeekId, leagueData }) => {
  const { address, viewOnlyMode } = useUserAccount();
  const { isValidating, data } = useSeasonUserData(
    selectedWeekId,
    leagueData.userLeague || 'Bronze'
  );
  const pnl = useMemo(() => {
    if (data && address) {
      const userData =
        data.winners?.find(
          (w) => w.userAddress.toLowerCase() === address.toLowerCase()
        ) ||
        data.loosers?.find(
          (l) => l.userAddress.toLowerCase() === address.toLowerCase()
        );
      return userData;
    }
    return undefined;
  }, [data, address]);
  const { data: rewardsAlloted } = useCompetitionRewardsAlloted();

  const selectedWeekAlloted = useMemo(() => {
    if (rewardsAlloted === undefined) {
      return undefined;
    }
    return rewardsAlloted.filter((r) => r.weekId == selectedWeekId);
  }, [rewardsAlloted, selectedWeekId]);

  const selectedWeekAllotedAMount = useMemo(() => {
    if (selectedWeekAlloted === undefined) {
      return undefined;
    }
    return selectedWeekAlloted.reduce((acc, r) => {
      return add(acc, r.amount);
    }, '0');
  }, [selectedWeekAlloted]);
  //
  return (
    <div className="bg-[#141823] px-[18px] py-6 flex items-end justify-between min-w-[300px] rounded-lg sm:w-full">
      <div className="flex flex-col gap-5">
        <Column head="PnL" data={<PnL data={pnl} isLoading={isValidating} />} />
        {/* <Column
          head="Loosers Rank"
          data={
            <RankWrapper
              isCurrentWeek={isCurrentWeek}
              isLooser
              leagueData={leagueData}
              selectedWeekId={selectedWeekId}
            />
          }
        />
        <Column
          head="Winners Rank"
          data={
            <RankWrapper
              isCurrentWeek={isCurrentWeek}
              leagueData={leagueData}
              selectedWeekId={selectedWeekId}
            />
          }
        /> */}
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
                data={ntoFixed(
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
            isNotAlloted={
              rewardsAlloted !== undefined && selectedWeekAlloted === undefined
            }
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
      }[]
    | undefined;
  isNotAlloted: boolean;
}> = ({ allotedRewards, selectedWeekRebate, isNotAlloted }) => {
  const { data: claimedRewards } = useCompetitionRewardsClaimed();
  if (claimedRewards === undefined) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc ml-auto" />
    );
  }
  if (allotedRewards === undefined && isNotAlloted) {
    return <span></span>;
  }
  if (allotedRewards === undefined) {
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
  if (
    claimedRewards.some((r) =>
      allotedRewards.find((a) => a.reward_id == r.reward_id)
    )
  ) {
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
  }[];
}> = ({ allotedRewards }) => {
  const { writeCall } = useWriteCall(
    competitionRewardAddress,
    CompetitionRewardABI
  );
  const [isLoading, setIsLoading] = useState(false);
  const toastify = useToast();

  const params = allotedRewards.map((reward) => [
    reward.address,
    reward.token,
    reward.amount,
    reward.reward_id,
    reward.time_threshold,
    reward.signature,
  ]);
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
            [params]
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

const RankWrapper: React.FC<{
  selectedWeekId: number;
  isCurrentWeek?: boolean;
  isLooser?: boolean;
  leagueData: ILeaderboardQuery;
}> = ({ selectedWeekId, leagueData, isLooser, isCurrentWeek }) => {
  const { address } = useUserAccount();
  const { data, isValidating } = useSeasonUserData(
    selectedWeekId,
    leagueData?.userLeague || 'Bronze'
  );
  if (address === undefined) {
    return <span className="text-f22">-</span>;
  }
  if (isCurrentWeek)
    return (
      <span
        className="text-f22"
        title="Ongoing season rank will be updated on season end"
      >
        -
      </span>
    );

  if (data === undefined) {
    return <span className="text-f22">-</span>;
  }
  return (
    <Rank
      selectedWeekId={selectedWeekId}
      data={data}
      userAddress={address}
      isLooser={isLooser}
    />
  );
};

const Rank: React.FC<{
  selectedWeekId: number;
  data: ILeaderboardQuery;
  isLooser?: boolean;

  userAddress: string;
}> = ({ data, userAddress, isLooser }) => {
  console.log(`UserRewards-data: `, data);
  const userRanks = useMemo(() => {
    let looserRank = 0;
    let winnerRank = 0;
    const index = data.winners.findIndex(
      (w) => getAddress(w.userAddress) === getAddress(userAddress)
    );
    console.log(`UserRewards-index: `, index);
    if (index !== -1) {
      winnerRank = index + 1;
    }
    const index2 = data.loosers.findIndex(
      (l) => getAddress(l.userAddress) === getAddress(userAddress)
    );
    console.log(`UserRewards-index2: `, index2);
    if (index2 !== -1) {
      looserRank = index2 + 1;
    }
    return [winnerRank, looserRank];
  }, [data, userAddress]);
  if (data == undefined) {
    return (
      <Skeleton variant="rectangular" className="w-[80px] !h-7 lc mr-auto" />
    );
  }
  console.log(`UserRewards-userRanks: `, userRanks, data);
  const userRank = isLooser ? userRanks[1] : userRanks[0];
  const rankingTitle =
    'Placed ' + userRank + ' in ' + isLooser
      ? 'Loosers Leaderboard'
      : 'Winners Leaderboard';
  return (
    <span className="text-f22" title={userRank ? rankingTitle : 'Unranked'}>
      {userRank || '-'}
    </span>
  );
};
