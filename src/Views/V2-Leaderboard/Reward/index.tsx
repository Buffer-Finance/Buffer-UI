import FrontArrow from '@SVG/frontArrow';
import { LeaderBoard } from '..';
import { TopData } from '../Components/TopData';
import { DailyStyles } from '../Daily/stlye';

export const Reward = () => {
  const content = <div>Reward table</div>;
  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div className="m-auto mb-7">
            <TopData
              pageImage={<></>}
              heading={
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>Reward Leaderboard</div>
                  </div>
                  <a
                    className="whitespace-nowrap flex items-center text-buffer-blue text-f13 hover:underline"
                    //TODO - new leaderboard : add link
                    href={'#'}
                    target={'blank'}
                  >
                    Contest Rules <FrontArrow className="tml w-fit inline" />
                  </a>
                </div>
              }
              DataCom={content}
            />
          </div>
        </DailyStyles>
      }
    />
  );
};
