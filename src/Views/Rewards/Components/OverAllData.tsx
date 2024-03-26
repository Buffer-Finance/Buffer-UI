import { divide } from '@Utils/NumString/stringArithmatics';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { getTimestampFromWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import { Skeleton } from '@mui/material';
import { useSeasonTotalData } from '../Hooks/useSeasonTotalData';
import { useShutterHandlers } from './SeasonsShutter';

export const OverAllData: React.FC<{
  selectedSeason: number;
  selectedWeekId: number;
  currentWeekId: number;
}> = ({ selectedSeason, selectedWeekId, currentWeekId }) => {
  const { openShutter } = useShutterHandlers();
  const { data, isValidating } = useSeasonTotalData(selectedWeekId);

  const selectedWeekStartDate = new Date(
    getTimestampFromWeekId(selectedWeekId) * 1000
  );
  const selectedWeekEndDate = new Date(
    getTimestampFromWeekId(selectedWeekId + 1) * 1000
  );
  return (
    <div className="w-full">
      <div
        className="text-[#F7F7F7] text-[26px] font-medium mb-4 w-fit sm:mx-auto sm:flex sm:items-center sm:gap-3"
        onClick={() => {
          openShutter();
        }}
      >
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/LeftArrow.svg`}
          alt="arrow"
          className={`a600:hidden`}
        />
        <span className="sm:mb-1">Season {selectedSeason}</span>
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/RightArrow.svg`}
          alt="arrow"
          className={`a600:hidden`}
        />
      </div>
      <div className="flex gap-5 items-start sm:flex-col">
        <div className="bg-[#141823] rounded-lg px-[20px] py-4 min-w-[300px] sm:w-full">
          <TableAligner
            keyStyle="!text-f16 !text-[#7F87A7] !text-start !pl-[0] !py-3 !pr-8"
            valueStyle="!text-f16 !px-[0] !py-3 !text-end"
            keysName={['Begins', 'Ends', 'Max Allocated']}
            values={[
              <span>
                <span className="text-[#FFFFFF]">
                  {selectedWeekStartDate.toLocaleDateString()}
                </span>
                <span className="text-[#7F87A7]"> 4PM</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">
                  {selectedWeekEndDate.toLocaleDateString()}
                </span>
                <span className="text-[#7F87A7]"> 4PM</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">500,000</span>
                <span className="text-[#7F87A7]"> ARB</span>
              </span>,
            ]}
          />
        </div>
        <div className="bg-[#141823] rounded-lg px-[20px] py-4 min-w-[300px] sm:w-full">
          <TableAligner
            keyStyle="!text-f16 !text-[#7F87A7] !text-start !pl-[0] !py-3 !pr-8"
            valueStyle="!text-f16 !px-[0] !py-3 !text-end"
            keysName={['To be distributed', 'Volume', 'Total traders']}
            values={[
              currentWeekId == selectedWeekId ? (
                <span className="text-[#7F87A7]">Ongoing...</span>
              ) : currentWeekId < selectedWeekId ? (
                <span className="text-[#7F87A7]">Not Started Yet.</span>
              ) : (
                <span>
                  <span className="text-[#FFFFFF]">50,000</span>
                  <span className="text-[#7F87A7]"> ARB</span>
                </span>
              ),

              currentWeekId < selectedWeekId ? (
                <span className="text-[#7F87A7]">Not Started Yet.</span>
              ) : isValidating ? (
                <Skeleton
                  variant="rectangular"
                  className="w-[80px] !h-5 lc ml-auto"
                />
              ) : (
                <span>
                  <span className="text-[#FFFFFF]">
                    {divide(data?.volume ?? '0', 6)}
                  </span>
                  <span className="text-[#7F87A7]"> USDC</span>
                </span>
              ),
              currentWeekId < selectedWeekId ? (
                <span className="text-[#7F87A7]">Not Started Yet.</span>
              ) : isValidating ? (
                <Skeleton
                  variant="rectangular"
                  className="w-[80px] !h-5 lc ml-auto"
                />
              ) : (
                <span>
                  <span className="text-[#FFFFFF]">
                    {data?.participents ?? 0}
                  </span>
                </span>
              ),
            ]}
          />
        </div>
      </div>
    </div>
  );
};
