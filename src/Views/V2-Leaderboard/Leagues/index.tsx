import { useActiveChain } from '@Hooks/useActiveChain';
import FrontArrow from '@SVG/frontArrow';
import { getConfig as getTradeCOnfig } from '@Views/TradePage/utils/getConfig';
import { useParams } from 'react-router-dom';
import { LeaderBoard } from '..';
import { BarData } from '../Components/BarData';
import { ContestEndWarning } from '../Components/ContestEndWarning';
import { TimerOrData } from '../Components/Timer';
import { TopData } from '../Components/TopData';
import { DailyStyles } from '../Daily/style';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import { getTournamentEndDateFromWeek } from '../Incentivised';
import { WinnersByPnl } from './WinnersByPnl';
import { getLeaderboardWeekId } from './WinnersByPnl/getWeekId';
import { leagueType } from './atom';
import {
  bronzeTournamentConfig,
  diamondTournamentConfig,
  goldTournamentConfig,
  leagueConfig,
  platinumTournamentConfig,
  silverTournamentConfig,
} from './config';
import { useLeagueNFTusers } from './useLeagueNFTusers';
import { LeagueCriteria } from './LeagueCriteria';

function getConfig(league: string, activeChainId: number) {
  switch (league) {
    case 'gold':
      return goldTournamentConfig[activeChainId];
    case 'platinum':
      return platinumTournamentConfig[activeChainId];
    case 'diamond':
      return diamondTournamentConfig[activeChainId];
    case 'silver':
      return silverTournamentConfig[activeChainId];
    case 'bronze':
      return bronzeTournamentConfig[activeChainId];
    default:
      return undefined;
  }
}

function isLeagueType(str: string) {
  const validLeagueTypes = ['silver', 'gold', 'platinum', 'diamond', 'bronze'];
  return validLeagueTypes.includes(str.toLowerCase());
}

export function capitalizeString(str: string | undefined) {
  if (str === undefined) return undefined;
  if (!isLeagueType(str)) return undefined;
  return str.replace(/^.| ./g, (match) => match.toUpperCase());
}

const Leagues = () => {
  const { activeChain } = useActiveChain();
  const { startTimestamp } = leagueConfig[activeChain.id];
  const { week, nextTimeStamp } = useWeekOfTournament({
    startTimestamp: startTimestamp,
  });
  const { offset, setOffset } = useWeekOffset();
  const { league } = useParams<{ league: leagueType }>();
  useLeagueNFTusers();
  if (league === undefined) return <>Wrong page</>;
  if (!isLeagueType(league)) return <>Wrong page</>;
  const configValue = getConfig(league, activeChain.id);
  if (configValue === undefined) return <>Wrong page</>;
  const config = getTradeCOnfig(activeChain.id);

  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div>
            <ContestEndWarning
              endDate={getTournamentEndDateFromWeek({
                startTimestamp: startTimestamp,
                endWeek: configValue.endDay,
              })}
              isClosed={
                configValue.endDay && week !== null
                  ? week >= configValue.endDay
                  : false
              }
            />
            {
              <div className="m-auto mb-7">
                <TopData
                  pageImage={
                    <img
                      src={`/LeaderBoard/${capitalizeString(league)}.png`}
                      alt="Icon"
                      width={65}
                      height={65}
                      className={`mr-3`}
                    />
                  }
                  heading={
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="capitalize">{league} League</div>
                        </div>
                        <a
                          className="whitespace-nowrap flex items-center text-[#7F87A7] text-f16 hover:underline"
                          href={configValue.contestRules}
                          target={'blank'}
                        >
                          Contest Rules{' '}
                          <FrontArrow
                            className="ml-2 w-fit inline scale-125 mt-1"
                            arrowColor="#7F87A7"
                          />
                        </a>
                      </div>
                    </div>
                  }
                  // desc={'helo'}
                  DataCom={
                    <div>
                      <LeagueCriteria league={league} />
                      <TimerOrData
                        startTimestamp={startTimestamp}
                        Data={
                          <>
                            <BarData
                              week={week}
                              resetTimestamp={nextTimeStamp}
                              offset={offset}
                              setOffset={setOffset}
                              activeChainId={activeChain.id}
                              league={league}
                              weekId={getLeaderboardWeekId(
                                parseInt(offset ?? '0')
                              )}
                            />
                            <div className="flex flex-col justify-center sm:max-w-[590px] m-auto">
                              <WinnersByPnl
                                activeChainId={activeChain.id}
                                league={league}
                                offset={offset}
                                week={week}
                              />
                            </div>
                          </>
                        }
                      />
                    </div>
                  }
                />
              </div>
            }
          </div>
        </DailyStyles>
      }
    />
  );
};

export default Leagues;
