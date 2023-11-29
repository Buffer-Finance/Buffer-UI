import {
  activeTournamentDataReadOnlyAtom,
  isTableShownAtom,
} from '@Views/NoLoss-V3/atoms';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { NoLossV3Timer } from '../NoLossV3Timer';
import { NoLossSection } from '../TradePageNoLoss';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  const activeTournamentData = useAtomValue(activeTournamentDataReadOnlyAtom);
  const expanded = useAtomValue(isTableShownAtom);

  const isTournamentClosed =
    activeTournamentData !== undefined &&
    activeTournamentData.data !== undefined &&
    activeTournamentData.data.state.toLowerCase() === 'closed';

  const isTournamentUpcoming =
    activeTournamentData !== undefined &&
    activeTournamentData.data !== undefined &&
    activeTournamentData.data.state.toLowerCase() === 'upcoming';

  const isexpired =
    activeTournamentData !== undefined &&
    activeTournamentData.data !== undefined &&
    +activeTournamentData.data.tournamentMeta.close <
      Math.floor(Date.now() / 1000);

  return (
    <div
      className={`flex ${
        !isMobile ? '' : 'flex-col'
      } justify-start h-full w-[100%] bg-[#1C1C28]`}
    >
      {/* {!isMobile && <WinningPrizeModal />} */}
      {!isMobile && <NoLossSection isMobile={isMobile} />}

      {activeTournamentData?.data === undefined ? (
        <div className="p-4">
          <Skeleton className="!w-screen !h-full !transform-none lc" />
        </div>
      ) : (
        <div
          className={`flex ${
            !isMobile ? '' : 'flex-col'
          } justify-start h-full w-[100%] bg-[#1C1C28] relative`}
        >
          {isTournamentUpcoming && (
            <div className="absolute top-[0] bottom-[0] right-[0] left-[0] bg-[rgb(20,24,35,0.7)] z-[1000] flex items-center justify-center">
              <div className="bg-[#030305] py-5 px-8 rounded-md text-[#C3C2D4] text-f15 opacity-100 flex flex-col items-center relative">
                <div className="">
                  {activeTournamentData.data?.tournamentMeta.name} has not
                  started yet.
                </div>
                <div className="mt-4 mb-2">
                  {isexpired ? 'Expired' : 'Starts in'}
                </div>
                <div className="flex items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="scale-75 mt-1"
                  >
                    <path
                      d="M12 1C9.82441 1 7.69767 1.64514 5.88873 2.85383C4.07979 4.06253 2.66989 5.78049 1.83733 7.79048C1.00477 9.80047 0.786929 12.0122 1.21137 14.146C1.6358 16.2798 2.68345 18.2398 4.22183 19.7782C5.76021 21.3165 7.72022 22.3642 9.85401 22.7886C11.9878 23.2131 14.1995 22.9952 16.2095 22.1627C18.2195 21.3301 19.9375 19.9202 21.1462 18.1113C22.3549 16.3023 23 14.1756 23 12C22.9944 9.08433 21.8337 6.28969 19.772 4.228C17.7103 2.16631 14.9157 1.00559 12 1ZM12 21.3077C10.1591 21.3077 8.35957 20.7618 6.82893 19.7391C5.29828 18.7163 4.10529 17.2627 3.40082 15.5619C2.69634 13.8611 2.51202 11.9897 2.87116 10.1842C3.2303 8.37864 4.11677 6.72017 5.41847 5.41847C6.72018 4.11676 8.37865 3.23029 10.1842 2.87115C11.9897 2.51201 13.8611 2.69634 15.5619 3.40081C17.2627 4.10529 18.7163 5.29828 19.7391 6.82892C20.7618 8.35956 21.3077 10.1591 21.3077 12C21.3049 14.4677 20.3234 16.8335 18.5784 18.5784C16.8335 20.3234 14.4677 21.3049 12 21.3077ZM18.7692 12C18.7692 12.2244 18.6801 12.4396 18.5214 12.5983C18.3627 12.757 18.1475 12.8462 17.9231 12.8462H12C11.7756 12.8462 11.5604 12.757 11.4017 12.5983C11.243 12.4396 11.1538 12.2244 11.1538 12V6.07692C11.1538 5.85251 11.243 5.63729 11.4017 5.4786C11.5604 5.31992 11.7756 5.23077 12 5.23077C12.2244 5.23077 12.4396 5.31992 12.5983 5.4786C12.757 5.63729 12.8462 5.85251 12.8462 6.07692V11.1538H17.9231C18.1475 11.1538 18.3627 11.243 18.5214 11.4017C18.6801 11.5604 18.7692 11.7756 18.7692 12Z"
                      fill="#8F95A4"
                      stroke="#8F95A4"
                      stroke-width="0.5"
                    />
                  </svg>
                  <NoLossV3Timer
                    close={
                      activeTournamentData.data?.tournamentMeta.start ?? '0'
                    }
                    isClosed={false}
                    isUpcoming={true}
                    className="!text-f18"
                  />
                </div>
                {/* <Bar width={50 + '%'} color={'#3164E3'} className="left-[0]" /> */}
              </div>
            </div>
          )}

          {/* <MiddleSection
            isExpanded={isTournamentClosed ? isTournamentClosed : expanded}
            shouldHideExpandBtn={isTournamentClosed}
            isMobile={isMobile}
            isTournamentClosed={isTournamentClosed}
            tournament={activeTournamentData?.data}
          /> */}
          {!isMobile && !isTournamentClosed && (
            <BuyTradeSection
              activeTournament={activeTournamentData.data}
              isTournamentUpcoming={isTournamentUpcoming}
            />
          )}
        </div>
      )}
    </div>
  );
};
