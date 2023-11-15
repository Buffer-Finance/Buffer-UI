import { createArray } from '@Utils/JSUtils/createArray';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { useUpdateActiveTournament } from '@Views/NoLoss-V3/Hooks/useUpdateActiveTournament';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  WinningPirzeModalAtom,
  activeMyAllTabAtom,
  activeTournamentIdAtom,
} from '../../atoms';
import { ItournamentData } from '../../types';
import { NoLossV3Timer } from '../NoLossV3Timer';
import { Person } from '../SVGs/Person';
import { RankOne } from '../SVGs/RankOneIcon';
import { Star } from '../SVGs/Star';
import { TotalWinnersTrophy } from '../SVGs/TotalWinnersTrophy';
import { WinnigPrizeModalBackground } from '../WinningPrizeModal';
import { TournamentCardButtons } from './TournamentCardButtons';

export const TradepageTournamentCard: React.FC<{
  tournament: ItournamentData;
  isTradePage?: boolean;
  isMobile: boolean;
}> = ({ tournament, isTradePage = true, isMobile }) => {
  const activeMyAllTab = useAtomValue(activeMyAllTabAtom);
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);
  const setWinPrizeModal = useSetAtom(WinningPirzeModalAtom);
  const { setActiveTournament } = useUpdateActiveTournament();

  function openWinPrizeModal() {
    setWinPrizeModal(tournament);
  }
  return (
    <div
      onClick={() => {
        setActiveTournament(tournament.id);
      }}
      className={`cursor-pointer mt-4 relative ${
        isMobile ? 'w-full' : 'w-[250px]'
      } background-vertical-gradient rounded-[4px] left-border px-[12px] py-[10px] pb-[20px] ${
        isTradePage && tournament.id == activeTournamentId
          ? 'border-[var(--bg-signature)] '
          : 'border-[transparent]'
      }`}
    >
      {/* <TradeCardBG className="absolute bottom-[10px0] right-[100px]" /> */}
      <div className="flex items-center justify-between">
        <div className="text-3 font-semibold text-f12">
          {tournament.tournamentMeta.name}
        </div>
        <div className="flex gap-1 items-center">
          {activeMyAllTab === 'my' && <Star />}

          <div
            className={`text-[8px] font-medium ${
              tournament.state.toLowerCase() === 'live'
                ? 'bg-green chip-green-border text-green'
                : tournament.state.toLowerCase() === 'upcoming'
                ? 'bg-[#00C4FF] chip-blue-border text-[#00C4FF]'
                : 'bg-[#C3C2D4] chip-gray-border text-[#C3C2D4]'
            }  bg-opacity-20 px-[6px] py-[1px]`}
          >
            {tournament.state}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <NoLossV3Timer
          close={tournament.tournamentMeta.close}
          isClosed={tournament.state.toLowerCase() === 'closed'}
        />
      </div>
      <div className="flex flex-col b1200:flex-row b1200:justify-between">
        <div className="">
          <div className="flex justify-start items-center gap-8">
            <div className="flex-col text-f12 items-start">
              <div className="text-3">Prize Pool</div>
              <div>
                {divide(
                  tournament.tournamentRewardPools.toString(),
                  tournament.rewardTokenDecimals
                )}
                &nbsp;
                {tournament.rewardTokenSymbol}
              </div>
            </div>
            <div className="flex-col text-f12 items-start">
              <div className="text-3">Mint Amount</div>
              <div>
                {/* {balance ? ( */}
                <Display
                  data={divide(
                    tournament.tournamentMeta.playTokenMintAmount,
                    18
                  )}
                  className="text-1 content-start"
                  precision={2}
                />
                {/* ) : (
          <Skeleton className="lc sr !w-[20px] !h-[14px]" />
        )} */}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start mt-4 gap-4">
            <NumberTooltip
              className="!p-[0]"
              content={
                <WinnigPrizeModalBackground>
                  <div className="capitalize text-f14 m-auto text-center mb-4">
                    reward distribution
                  </div>
                  <TableAligner
                    getClassName={(row, rowIndex) => {
                      if (rowIndex === 0) {
                        return 'bg-[#13131a]';
                      }
                      if (rowIndex % 2 === 0) {
                        return 'bg-[#303044]';
                      }
                      return 'bg-[#1d1d28]';
                    }}
                    keyStyle="text-1 !text-f12 !p-[8px] "
                    valueStyle="text-1 !text-f12 !p-[8px] "
                    keysName={[
                      'Position',
                      ...createArray(
                        tournament.tournamentLeaderboard.rewardPercentages
                          .length
                      ).map((_, idx) => idx + 1),
                    ]}
                    values={[
                      'Prize',
                      ...tournament.tournamentLeaderboard.rewardPercentages.map(
                        (percentage) => (
                          <Display
                            data={getValueOfPercentage(
                              divide(
                                tournament.tournamentRewardPools.toString(),
                                tournament.rewardTokenDecimals
                              ) as string,
                              divide(percentage.toString(), 2) as string
                            )}
                            unit={tournament.rewardTokenSymbol}
                            precision={2}
                          />
                        )
                      ),
                    ]}
                  />
                </WinnigPrizeModalBackground>
              }
            >
              <div className="flex items-center text-f12 ">
                <RankOne />
                <div
                  className="ml-2 text-buffer-blue underline underline-offset-2"
                  // onClick={openWinPrizeModal}
                >
                  {getValueOfPercentage(
                    divide(
                      tournament.tournamentRewardPools.toString(),
                      tournament.rewardTokenDecimals
                    ) as string,
                    divide(
                      tournament.tournamentLeaderboard.rewardPercentages[0].toString(),
                      2
                    ) as string
                  )}
                  &nbsp;
                  {tournament.rewardTokenSymbol}
                </div>
              </div>
            </NumberTooltip>

            <NumberTooltip
              content={`
                ${parseInt(
                  tournament.tournamentLeaderboard.userCount
                )}/${parseInt(
                tournament.tournamentConditions.maxParticipants
              )} have participated in the tournament.
                `}
            >
              <div className="flex items-center gap-x-2 text-f12">
                <Person className="mt-1" />
                {parseInt(tournament.tournamentLeaderboard.userCount)}/
                {parseInt(tournament.tournamentConditions.maxParticipants)}
              </div>
            </NumberTooltip>

            <NumberTooltip
              content={`First ${parseInt(
                tournament.tournamentLeaderboard.totalWinners
              )} players will win the prize.`}
            >
              <div className="flex items-center gap-2">
                <TotalWinnersTrophy />
                <div className="text-f12">
                  {parseInt(tournament.tournamentLeaderboard.totalWinners)}
                </div>
              </div>
            </NumberTooltip>
          </div>
        </div>
        <TournamentCardButtons
          activeAllMyTab={activeMyAllTab}
          tournament={tournament}
          activeTournamentId={isTradePage ? activeTournamentId : undefined}
        />
      </div>
    </div>
  );
};

export function getValueOfPercentage(totalValue: string, percentage: string) {
  return divide(multiply(totalValue, percentage), 2) as string;
}
