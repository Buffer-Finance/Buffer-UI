import { Input } from '@/components/ui/input';
import { cn } from '@Utils/cn';
import { compactFormatter } from '@Utils/NumberUtils';
import ValueFormatter from '@Views/Common/Aligner';
import { AddressGravatar } from '@Views/Common/Gravatar';
import { BlueBtn } from '@Views/Common/V2-Button';
import { formatAddress } from '@Views/Jackpot/JackPotWInnerCard';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { TrendingUp, Trophy } from 'lucide-react';
// id: p.string(),
// account: p.string(),
// amount: p.bigint(),
// volume: p.bigint(),
// tradeCnt: p.bigint(),
// updatedAt: p.bigint(),
const leaderboardData1stpage = [
  {
    id: '0x0x52bE06E343Dbb35077BfD41C146FfA8156667',
    account: '0x0x52bE86E343Db35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },

  // Add more data as needed
];
const leaderboardDataPaginated = [
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156667',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },
  {
    id: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156689',
    account: '0x0x52bE86E343Dbb35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
  },

  // Add more data as needed
];

const BFRfarmingLeaderboard: React.FC<any> = ({}) => {
  return (
    <div className=" text-gray-100 p-6 rounded-lg max-w-6xl mx-auto">
      <div>
        <h1 className="cool-text text-f24 text-center font-bold">
          BFR Farming Contest
        </h1>
        <div className="w-full text-center my-3 text-f12 text-slate-300">
          Win upto{' '}
          <span className="cool-text font-semibold "> 100BFR per trade</span>
          &nbsp;opening. Higher the league, higher the rewards.
        </div>
        {/*  <div role="button">
          Opening a trade yields BFR points according to user's NFT holding.
        </div>
        <div role="button">
          Diamond League gets 100 Points | Diamond League gets 100 Points
        </div>
        <div className="flex gap-1 text-f12 text-2">
          <div className="flex items-center gap-1 justify-end">
            <img
              src="/public/LeaderBoard/Diamond.png"
              style={{
                width: 15,
                height: 15,
                borderRadius: '100%',
                objectFit: 'contain',
              }}
            />
            Diamond : 100 Pts
          </div>
          |
          <div className="flex items-center gap-1 justify-end">
            <img
              src="/public/LeaderBoard/Platinum.png"
              style={{
                width: 15,
                height: 15,
                borderRadius: '100%',
                objectFit: 'contain',
              }}
            />
            Platinum
          </div>
          |
          <div className="flex items-center gap-1 justify-end">
            <img
              src="/public/LeaderBoard/Gold.png"
              style={{
                width: 15,
                height: 15,
                borderRadius: '100%',
                objectFit: 'contain',
              }}
            />
            Gold
          </div>
          |
          <div className="flex items-center gap-1 justify-end">
            <img
              src="/public/LeaderBoard/Silver.png"
              style={{
                width: 15,
                height: 15,
                borderRadius: '100%',
                objectFit: 'contain',
              }}
            />
            Silver
          </div>
          |
          <div
            className="flex items-center"
            title={"Users who don't own any NFT"}
          >
            <img
              src="/public/LeaderBoard/Bronze.png"
              style={{
                width: 15,
                height: 15,
                borderRadius: '100%',
                objectFit: 'contain',
              }}
            />
            Bronze (No NFT)
          </div>
        </div>
        <ValueFormatter
          keyStyles={' '}
          keyColumnStyles="flex !gap-1 text-f12 text-2  mr-1"
          valueColumnStyles="flex !gap-1 text-f12 text-2"
          keys={[
            <div className="flex items-center gap-1 justify-end">
              <img
                src="/public/LeaderBoard/Diamond.png"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '100%',
                  objectFit: 'contain',
                }}
              />
              Diamond
            </div>,
            <div className="flex items-center gap-1 justify-end">
              <img
                src="/public/LeaderBoard/Platinum.png"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '100%',
                  objectFit: 'contain',
                }}
              />
              Platinum
            </div>,
            <div className="flex items-center gap-1 justify-end">
              <img
                src="/public/LeaderBoard/Gold.png"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '100%',
                  objectFit: 'contain',
                }}
              />
              Gold
            </div>,
            <div className="flex items-center gap-1 justify-end">
              <img
                src="/public/LeaderBoard/Silver.png"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '100%',
                  objectFit: 'contain',
                }}
              />
              Silver
            </div>,
            <div
              className="flex items-center"
              title={"Users who don't own any NFT"}
            >
              <img
                src="/public/LeaderBoard/Bronze.png"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '100%',
                  objectFit: 'contain',
                }}
              />
              Bronze (No NFT)
            </div>,
          ]}
          values={['100 ', '2310 ', '200', '2310', '2310']}
        /> */}
      </div>
      {/* Top 3 Traders */}
      <div className="flex gap-5 my-6 rounded-md">
        {leaderboardData1stpage.map(
          (trader: (typeof leaderboardData1stpage)[0], index) => (
            <div
              key={index}
              className=" bg-[#25252fd4] p-4 rounded-lg flex flex-col gap-2 w-[380px]"
            >
              <div className="flex justify-between ">
                <div className="flex items-center gap-3 mb-2">
                  <AddressGravatar size={31} account={trader.account} />
                  <div className="flex flex-col gap-1 ">
                    <div className="text-[11px]">
                      {formatAddress(trader.account)}
                    </div>
                    <RankFormatter full index={index} />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[10px] text-2">Reward Points</div>
                  <RewardPoint rewards={trader.amount} className="mt-[1px]" />
                </div>
              </div>
              <div className="text-2  mt-2      text-[10px] w-full text-center">
                {/* <TrendingUp className="text-green-400" size={15} /> Volume */}
                <span className="text-slate-400">
                  {compactFormatter(trader.volume / 1e8)}💲
                </span>
                volume traded in{' '}
                <span className="text-slate-400">
                  &nbsp;{trader.tradeCnt} trades
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Leaderboard Header */}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto bg-[#25252fd4]  rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-f16 font-bold text-slate-300">Leaderboard</h2>
        </div>
        <table className="w-full border-separate border-spacing-[0px]">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2" align="center">
                Rank
              </th>
              <th className="p-2" align="center">
                Trader
              </th>
              <th className="p-2" align="center">
                Volume (USD)
              </th>
              <th className="p-2" align="center">
                No. of trades
              </th>
              <th className="p-2" align="center">
                Reward Points
              </th>
            </tr>
          </thead>
          <tbody className="text-f12">
            {leaderboardDataPaginated.map(
              (trader: (typeof leaderboardData1stpage)[0], index) => (
                <tr key={trader.id} className="group     ">
                  <td
                    align="center"
                    className={cn(
                      'px-4 py-3 bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] ',
                      index == 0 && 'rounded-tl-lg'
                    )}
                  >
                    <RankFormatter index={index} />
                  </td>
                  <td
                    align="center"
                    className="px-4 py-3 bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] "
                  >
                    <div className="flex items-center w-fit gap-2">
                      <AddressGravatar account={trader.account} />
                      {formatAddress(trader.account)}{' '}
                    </div>
                  </td>
                  <td
                    align="center"
                    className="px-4 py-3 bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] "
                  >
                    {trader.volume / 1e6}
                  </td>
                  <td
                    align="center"
                    className="px-4 py-3 bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] "
                  >
                    {trader.tradeCnt}
                  </td>
                  <td
                    align="center"
                    className={cn(
                      'px-4 py-3  bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] ',
                      index == 0 && 'rounded-tr-lg'
                    )}
                  >
                    <RewardPointTable rewards={trader.amount} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <div className="w-full text-right bg-2 rounded-b-lg py-3  px-6">
          Total Participants : {leaderboardDataPaginated.length}
        </div>
      </div>

      {/* Pagination */}
    </div>
  );
};

export { BFRfarmingLeaderboard };

const RankFormatter: React.FC<{ index: number; full?: boolean }> = ({
  index,
  full,
}) => {
  return (
    <div
      className={cn(
        'text-[#e1e1e1]  font-semibold text-[11px] whitespace-nowrap  text-center',
        {
          'bg-[#0c47b6]': index === 0,
          'bg-[#0c48b6d3]': index === 1,
          'bg-[#0c48b696]': index === 2,
          'bg-[#a4a6a92c]': index > 2,
          full: 'w-fit px-2',
        },
        {
          'w-fit px-2 rounded-[3px]': full,
          'w-[20px] rounded-[20%] ': !full,
        }
      )}
    >
      {full ? 'Rank' : ''} {index + 1}
    </div>
  );
};
const RewardPoint: React.FC<{ rewards: number; className?: string }> = ({
  rewards,
  className,
}) => {
  return (
    <div
      className={cn(
        className,
        'text-[#e1e1e1] align-middle text-[12px] flex justify-center items-center  whitespace-nowrap  w-[60px] px-3 font-bold text-center rounded-md '
      )}
    >
      <Trophy className="text-yellow-400 mr-2" size={15} />
      {rewards}
    </div>
  );
};
const RewardPointTable: React.FC<{ rewards: number }> = ({ rewards }) => {
  return (
    <div
      className={cn(
        'text-[#e1e1e1]  whitespace-nowrap  w-[60px] px-3 font-bold text-center rounded-md bg-[#39a860a3]'
      )}
    >
      {rewards}
    </div>
  );
};
