import { useV3Config } from './useV3Config';
import { MultiChart } from 'src/MultiChart';
import { DynamicActiveAsset } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
// import { NoLossOptionBuying } from './NoLossOptionBuying';
import { Skeleton } from '@mui/material';
import { UserTrades } from '@Views/BinaryOptions/UserTrades';

const NoLoss: React.FC<any> = ({}) => {
  const { data: appConfig } = useV3Config();
  const activeTournament = false; //FIXME - temporary fix
  return (
    <main className="flex  w-[100vw]">
      {appConfig ? (
        <>
          <div className="flex flex-col flex-1">
            <div className="flex-1 relative  mr-2 mt-2 ">
              <MultiChart markets={appConfig} product="no-loss" />
            </div>
          </div>
          <div className="w-[281px] flex flex-col  border-left  pr-2 ">
            <DynamicActiveAsset markets={appConfig} payout="23%" />
            {activeTournament ? (
              <>
                {/* <NoLossOptionBuying
                  activeTournament={activeTournament}
                  markets={appConfig}
                /> */}
                <div className="flex-grow relative mt-[18px] text-2 mx-3">
                  <UserTrades />
                </div>
              </>
            ) : (
              <Skeleton
                className="lc sr w-full flex-1 !h-[300px] m-5  "
                variant="rectangular"
              />
            )}
          </div>
        </>
      ) : (
        <Skeleton
          className="lc sr w-full flex-1 !h-[50vh] m-5  "
          variant="rectangular"
        />
      )}
    </main>
  );
};

export { NoLoss };
