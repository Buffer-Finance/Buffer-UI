import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

export const OverAllData = () => {
  return (
    <div>
      <div className="text-[#F7F7F7] text-[26px] font-medium mb-4">
        Season 4
      </div>
      <div className="flex gap-5 items-start">
        <div className="bg-[#141823] rounded-lg px-[20px] py-4 min-w-[300px]">
          <TableAligner
            keyStyle="!text-f16 !text-[#7F87A7] !text-start !pl-[0] !py-3 !pr-8"
            valueStyle="!text-f16 !px-[0] !py-3 !text-end"
            keysName={['Begins', 'Ends', 'Max Allocated']}
            values={[
              <span>
                <span className="text-[#FFFFFF]">02/12/24</span>
                <span className="text-[#7F87A7]"> 5PM</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">02/26/24</span>
                <span className="text-[#7F87A7]"> 5PM</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">500,000</span>
                <span className="text-[#7F87A7]"> ARB</span>
              </span>,
            ]}
          />
        </div>
        <div className="bg-[#141823] rounded-lg px-[20px] py-4 min-w-[300px]">
          <TableAligner
            keyStyle="!text-f16 !text-[#7F87A7] !text-start !pl-[0] !py-3 !pr-8"
            valueStyle="!text-f16 !px-[0] !py-3 !text-end"
            keysName={['To be distributed', 'Volume', 'Total traders']}
            values={[
              <span>
                <span className="text-[#FFFFFF]">50,000</span>
                <span className="text-[#7F87A7]"> ARB</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">50,000</span>
                <span className="text-[#7F87A7]"> USDC</span>
              </span>,
              <span>
                <span className="text-[#FFFFFF]">50</span>
              </span>,
            ]}
          />
        </div>
      </div>
    </div>
  );
};
