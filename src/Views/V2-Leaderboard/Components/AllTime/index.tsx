import { useActiveChain } from '@Hooks/useActiveChain';
import FrontArrow from '@SVG/frontArrow';
import { LeaderBoard } from '@Views/V2-Leaderboard';
import { DailyStyles } from '@Views/V2-Leaderboard/Daily/style';
import { TopData } from '../TopData';
import { TableByPNL } from './TableByPNL';

export const AllTime = () => {
  const { activeChain } = useActiveChain();

  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div>
            {/* <ContestEndWarning
          endDate={getTournamentEndDateFromWeek({
            startTimestamp: startTimestamp,
            endWeek: configValue.endDay,
          })}
          isClosed={
            configValue.endDay && week !== null
              ? week >= configValue.endDay
              : false
          }
        /> */}
            {
              <div className="m-auto mb-7">
                <TopData
                  pageImage={
                    <></>
                    // <img
                    //   src={`/LeaderBoard/${capitalizeString(league)}.png`}
                    //   alt="Icon"
                    //   className="w-8 h-8 mr-3"
                    // />
                  }
                  heading={
                    <div className="flex flex-col items-start mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="capitalize">All time leaderboard</div>
                      </div>
                      <a
                        className="whitespace-nowrap flex items-center text-[#7F87A7] text-f16 hover:underline"
                        href={'google.com'}
                        target={'blank'}
                      >
                        Contest Rules{' '}
                        <FrontArrow
                          className="ml-2 w-fit inline scale-125 mt-1"
                          arrowColor="#7F87A7"
                        />
                      </a>
                    </div>
                  }
                  DataCom={
                    <>
                      <div className="flex flex-col justify-center sm:max-w-[590px] m-auto">
                        <TableByPNL activeChainId={activeChain.id} />
                      </div>
                    </>
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
