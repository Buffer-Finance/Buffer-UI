import { Skeleton } from '@mui/material';
import React from 'react';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { ILeague } from '../interfaces';
import { useUserAccount } from '@Hooks/useUserAccount';
import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { usdcDecimals } from '../Incentivised';
import { Rank } from '../Components/Rank';
import BasicPagination from '@Views/Common/pagination';

export const DailyMobileTable: React.FC<{
  options: ILeague[] | undefined;
  skip: number;
  userData: ILeague[] | undefined;
  onpageChange?: (e, page: number) => void;
  count: number;
  nftWinners?: number;
  activePage: number;
}> = ({
  options,
  skip,
  userData,
  count,
  onpageChange,
  nftWinners,
  activePage,
}) => {
  const { address: account } = useUserAccount();
  // if (!options)
  //   return (
  //     <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
  //   );
  let user = getUserIndex(options, skip, account);
  const UserRow =
    userData?.length && options?.length ? (
      <MobileRow
        {...{
          index: 0,
          currentStanding: { ...userData[0], rank: user == -1 ? '-' : '' },
          user,
          skip,
          userData,
          account,
        }}
      />
    ) : null;

  return (
    <div className=" mt-4 flex flex-col gap-4">
      {!options ? (
        <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
      ) : (
        <>
          {' '}
          {UserRow}
          {options.map((currentStanding, index) => {
            const isUser =
              currentStanding?.user &&
              currentStanding?.user.toLowerCase() === account?.toLowerCase();

            return (
              <MobileRow
                {...{
                  index,
                  currentStanding,
                  user: false,
                  skip,
                  userData,
                  account,
                  nftWinners,
                }}
              />
            );
          })}
        </>
      )}

      {count && count > 1 ? (
        <div className="mb-5">
          <BasicPagination
            onChange={onpageChange}
            count={count}
            page={activePage}
          />
        </div>
      ) : null}
    </div>
  );
};
export function getUserIndex(res, skip, account) {
  let userInTop10 = -1;
  if (res?.length && !skip && account) {
    const foundIndex = res.findIndex(
      (r) => r.user.toLowerCase() == account.toLowerCase()
    );
    if (foundIndex !== -1) {
      userInTop10 = foundIndex + 1;
    }
  }
  return userInTop10;
}

const MobileRow = ({
  index,
  currentStanding,
  user,
  skip,
  userData,
  account,
  nftWinners,
}) => {
  const isUser = user ? true : false;
  const perc = multiply(
    divide(currentStanding.netPnL, currentStanding.volume),
    2
  );
  const isNeg =
    typeof perc === 'string' ? (perc[0] == '-' ? true : false) : perc < 0;

  return (
    <div
      key={index}
      className={`text-f12 bg-1 rounded-lg p-5 table-width margin-auto ${
        user && 'highlight'
      }`}
    >
      {/* FIrst Row */}
      <div className="flex justify-between items-center mb-3">
        {/* Left Side*/}
        <div className="flex items-center">
          <div className="text-buffer-blue text-f14 mx-2">
            <Rank
              row={index}
              isUser={isUser}
              skip={skip}
              userData={userData}
              userRank={currentStanding.rank}
              nftWinners={nftWinners}
            />
          </div>
          <div className="text-f13 ml-1">
            {currentStanding?.user === account ? (
              <span className="text-1">Your Account</span>
            ) : (
              <div className="flex">
                <NumberTooltip
                  content={currentStanding?.user || ''}
                  className={isUser && index === 0 ? 'text-1' : ''}
                >
                  <div>
                    {isUser
                      ? 'Your Account'
                      : !currentStanding?.user
                      ? 'Wallet not connected'
                      : currentStanding?.user.slice(0, 4) +
                        '...' +
                        currentStanding?.user.slice(-4)}
                  </div>
                </NumberTooltip>
              </div>
            )}
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex flex-col">
          <div className="text-2 text-right">Trades</div>
          <div className="text-1 text-right">
            {!currentStanding.netPnL || currentStanding.netPnL === null
              ? '-'
              : currentStanding.totalTrades}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex justify-between items-center">
        {/* Left Side*/}
        <div className="flex flex-col">
          <div className="flex">
            <div className="text-2 mr-3">Net PnL</div>
            <div>
              {currentStanding.netPnL === null ? (
                '-'
              ) : (
                <Display
                  data={perc}
                  label={!isNeg ? '+' : ''}
                  className={`f15 ${!isNeg ? 'green' : 'red'}`}
                  unit={'%'}
                />
              )}
            </div>
          </div>
          <div className="flex">
            <div className="text-2 mr-3">Absolute PnL</div>
            <div>
              {currentStanding.netPnL === null ? (
                '-'
              ) : (
                <Display
                  data={divide(currentStanding.netPnL, usdcDecimals)}
                  label={gt(currentStanding.netPnL, '0') ? '+' : ''}
                  className={`f15 ${
                    gt(currentStanding.netPnL, '0') ? 'green' : 'red'
                  }`}
                  unit={'USDC'}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex flex-col">
          <div className="text-2 text-right">Volume</div>
          <div className="text-3 text-right">
            {currentStanding.netPnL === null ? (
              '-'
            ) : (
              <Display
                data={divide(currentStanding.volume, usdcDecimals)}
                unit={'USDC'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
