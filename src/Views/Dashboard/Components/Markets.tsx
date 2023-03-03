import { useActiveChain } from '@Hooks/useActiveChain';
import { useActiveAssetState } from '@Views/BinaryOptions/Hooks/useActiveAssetState';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useMemo } from 'react';
import { useDashboardTableData } from '../Hooks/useDashboardTableData';
import { DashboardTable } from './DashboardTable';

export const Markets = () => {
  const { dashboardData } = useDashboardTableData();
  const { activeChain } = useActiveChain();
  const referralcode = useReferralCode(activeChain);
  const [balance, allowance, maxTrade, stats, routerPermission] =
    useActiveAssetState(null, referralcode);
  const filteredDashboardData = useMemo(() => {
    if (!dashboardData || !routerPermission) return [];
    return dashboardData.filter((data) => routerPermission[data.address]);
  }, [dashboardData, routerPermission]);
  // console.log(filteredDashboardData[0].totalTrades, 'totalData');

  // const totalDataArr = [
  //   {
  //     key: 'Trading Volume',
  //     value: totalData ? (
  //       <Display
  //         data={divide(totalData.volume || '0', usdcDecimals)}
  //         unit={'USDC'}
  //       />
  //     ) : (
  //       '-'
  //     ),
  //   },
  //   {
  //     key: 'Open Interest',
  //     value: totalData ? (
  //       <Display data={totalData.openInterest || '0'} unit={'USDC'} />
  //     ) : (
  //       '-'
  //     ),
  //   },
  //   {
  //     key: 'Total Trades',
  //     value: totalData?.trades || '0',
  //   },
  // ];
  return (
    <div>
      {/* <div className="flex items-stretch justify-between gap-6 w-3/4 mb-7 max1000:w-[80%] max800:!w-full max800:flex-wrap">
        {totalDataArr.map((item) => (
          <div className="flex flex-col items-start gap-2 bg-2 rounded-lg py-5 px-7 flex-1">
            <div className="text-f18 whitespace-nowrap">{item.key}</div>
            <div className="text-[22px] text-light-blue font-medium">
              {item.value}
            </div>
          </div>
        ))}
      </div> */}
      <DashboardTable dashboardData={filteredDashboardData} />
    </div>
  );
};
