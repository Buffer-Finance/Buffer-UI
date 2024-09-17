import { Input } from '@/components/ui/input';
import { pdev } from '@ConfigContract';
import { Search } from 'lucide-react';

import { cn } from '@Utils/cn';
import { compactFormatter } from '@Utils/NumberUtils';
import ValueFormatter from '@Views/Common/Aligner';
import { AddressGravatar } from '@Views/Common/Gravatar';
import { BlueBtn } from '@Views/Common/V2-Button';
import { formatAddress } from '@Views/Jackpot/JackPotWInnerCard';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { TrendingUp, Trophy } from 'lucide-react';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

const leaderboardData1stpage = [
  {
    id: '0x0x52bE06E343Dbb35077BfD41C146FfA8156667',
    account: '0x0x52bE86E343Db35077BfD17A41C146FfA8156688',
    amount: 1140,
    volume: 12220000,
    tradeCnt: 26,
    rank: 0,
  },

  // Add more data as needed
];

const BFRfarmingLeaderboard: React.FC<any> = ({}) => {
  const {
    data: leaderboardDataPaginated,

    error,
  } = useSWR('leaderboardDataPaginated', async () => {
    const res = await pdev.post('/', {
      query: `{
        bfrFarmingPointss(orderBy: "amount", orderDirection: "desc") {
          items {
            account
            amount
            tradeCnt
            updatedAt
            volume
            id
          }
        }
      }`,
    });

    // console.log(`BFRfarmingLeaderboard-res.data: `);

    return res.data.data.bfrFarmingPointss.items.map(
      (item: any, index: number) => ({ ...item, rank: index })
    );
  });
  const [search, setSearch] = useState('');

  if (!leaderboardDataPaginated) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <div className=" text-gray-100 p-6 rounded-lg  mx-auto">
      <div>
        <h1 className="cool-text text-f28 text-center font-bold">
          BFR Farming Contest
        </h1>
        <div className="w-full text-center my-3 text-f15 text-slate-300">
          Win upto{' '}
          <span className="cool-text font-semibold "> 100BFR per trade</span>
          &nbsp;opening. Higher the league, higher the rewards.
        </div>
      </div>
      {/* Top 3 Traders */}
      <div className="flex gap-5 my-6 rounded-md">
        {leaderboardDataPaginated
          .slice(0, 3)
          .map((trader: (typeof leaderboardData1stpage)[0]) => (
            <div
              key={trader.id}
              className=" bg-[#25252fd4] p-4 rounded-lg  flex flex-col gap-2 w-[250px]"
            >
              <div className="flex justify-between ">
                <div className="flex items-center gap-3 mb-2">
                  <AddressGravatar size={31} account={trader.account} />
                  <div className="flex flex-col gap-1 ">
                    <div className="text-f12">
                      {formatAddress(trader.account)}
                    </div>
                    <RankFormatter full index={trader.rank} />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[12px] text-2">Reward Points</div>
                  <RewardPoint rewards={trader.amount} className="mt-[1px] " />
                </div>
              </div>
              <div className="text-2  mt-2      text-[12px] w-full text-center">
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
          ))}
      </div>

      {/* Leaderboard Header */}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto bg-[#25252fd4]  rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-f20 font-bold text-slate-300">Leaderboard</h2>
          <SearchComponent {...{ search, setSearch }} />
        </div>
        <table className="w-full border-separate border-spacing-[0px] text-f14">
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
          <tbody className="text-f14  ">
            {leaderboardDataPaginated
              .filter((a: (typeof leaderboardData1stpage)[0]) => {
                if (!search) return true;
                return a.account.toLowerCase().includes(search.toLowerCase());
              })
              .map((trader: (typeof leaderboardData1stpage)[0]) => (
                <tr key={trader.id} className="group     ">
                  <td
                    align="center"
                    className={cn(
                      'px-4 py-3 bg-2 boredom-bottom group-hover:bg-[#3e3e4f30] ',
                      trader.rank == 0 && 'rounded-tl-lg'
                    )}
                  >
                    <RankFormatter index={trader.rank} />
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
                      trader.rank == 0 && 'rounded-tr-lg'
                    )}
                  >
                    <RewardPointTable rewards={trader.amount} />
                  </td>
                </tr>
              ))}
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
        'text-[#e1e1e1]  font-semibold text-[13px] whitespace-nowrap  text-center',
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
        'text-[#e1e1e1] w-[100px] align-middle text-[14px] flex justify-center items-center  whitespace-nowrap  px-3 font-bold text-center rounded-md '
      )}
    >
      <Trophy className="text-yellow-400 mr-2" size={14} />
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

export default function SearchComponent({
  search,
  setSearch,
}: {
  search: string;
  setSearch: any;
}) {
  return (
    <div className="w-fit">
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={search}
          placeholder="Search user address..."
          className="w-[260px] pl-[28px] py-2 pl-10 pr-4 text-f13 text-gray-400 bg-[#292a31] border border-[#292a31] rounded-lg focus:outline-none  focus:border-[#333c85a6] hover:brightness-110"
          aria-label="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3"
          aria-label="Submit search"
        >
          <Search className="w-5 h-5 text-gray-400" />
        </button>
      </form>
    </div>
  );
}
