import FailedSuccess from '@Assets/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import MemoBackIcon from '@SVG/Elements/BackIcon';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  expiryPriceCache,
  getPriceCacheId,
} from '@Views/TradePage/Hooks/useBuyTradeActions';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { AssetCell } from '@Views/TradePage/Views/AccordionTable/AssetCell';
import {
  DisplayTime,
  StrikePriceComponent,
  getExpiry,
  queuedTradeFallBack,
} from '@Views/TradePage/Views/AccordionTable/Common';
import { Share } from '@Views/TradePage/Views/AccordionTable/ShareModal/ShareIcon';
import { tradeInspectMobileAtom } from '@Views/TradePage/atoms';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';
import { getAddress } from 'viem';
import { getPayout } from '../../Views/AccordionTable/ShareModal/utils';
import { activeTabAtom } from './TradeLog_sm';
const className = 'text-green text-red text-[#C3C2D4] text-[#808191] text-f14 ';
const valueClasssName = '!text-[#C3C2D4] !text-f14 !ml-auto !justify-end';
const keyClassName = '!text-[#808191] !text-f14';
const TradeInspect_sm: React.FC<any> = ({}) => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const readcallData = useAtomValue(buyTradeDataAtom);
  const { trade } = useAtomValue(tradeInspectMobileAtom);
  const setInspectedTrade = useSetAtom(tradeInspectMobileAtom);
  const { getPoolInfo } = usePoolInfo();
  if (!trade) return <div>Error loading data</div>;
  if (!readcallData) return <div>Error loading data</div>;

  const maxOi = readcallData.maxOIs[getAddress(trade.target_contract)];
  const currentOi = readcallData.currentOIs[getAddress(trade.target_contract)];

  const poolInfo = getPoolInfo(trade.pool.pool);
  let expiryPrice: number | null = trade.expiry_price;
  if (!expiryPrice) {
    const id = getPriceCacheId(trade);
    expiryPrice = expiryPriceCache[id] || 0;
  }
  const tradeExpiry = getExpiry(trade);
  const { pnl, payout } = getPayout(trade, expiryPrice, poolInfo.decimals);

  const status = gt(pnl?.toString(), '0')
    ? {
        tooltip: 'You won this bet!',
        chip: 'Win',
        icon: <SuccessIcon width={14} height={14} />,
        textColor: 'text-green',
      }
    : {
        tooltip: 'You lost this trade!',
        chip: 'Loss',
        icon: <FailedSuccess width={14} height={14} />,
        textColor: '',
      };

  const ExpiryPrice = {
    key: 'Expiry Price',
    value: !expiryPrice ? (
      'Fetching..'
    ) : (
      <Display
        className={valueClasssName}
        data={divide(expiryPrice, 8)}
        precision={trade.market.price_precision.toString().length - 1}
      />
    ),
  };
  const OpenTime = {
    key: 'Open',
    value: queuedTradeFallBack(trade) || (
      <DisplayTime ts={trade.open_timestamp} className="!ml-auto" />
    ),
  };
  const Duration = {
    key: 'Duration',
    value: queuedTradeFallBack(trade, true) || (
      <div className={trade.state == 'OPENED' ? 'text-red' : ''}>
        {formatDistance(Variables(tradeExpiry - trade.open_timestamp))}
      </div>
    ),
  };
  const CloseTime = {
    key: 'Closed',
    value: queuedTradeFallBack(trade) || (
      <DisplayTime ts={tradeExpiry} className="!ml-auto" />
    ),
  };
  const Payout =
    pnl || payout
      ? {
          key: 'Payout',
          value: (
            <Display
              className={valueClasssName}
              data={divide(payout!, poolInfo.decimals)}
              unit={poolInfo.token}
            />
          ),
        }
      : null;

  const Status =
    pnl || payout
      ? {
          key: 'Status',
          value: (
            <div className={valueClasssName + ' flex'}>
              {activeTab == 'History' ? (
                <Share data={trade} market={trade.market} poolInfo={poolInfo} />
              ) : null}

              <div
                className={`flex ${status.textColor}  sm:flex-row-reverse items-center justify-between w-max px-2   rounded-[5px] bg-[#282B39]`}
              >
                <div
                  className={
                    'text-f13 font-normal web:mr-2 tab:mx-2' +
                    ` ${status.textColor}`
                  }
                >
                  {status.chip}
                </div>

                {status.icon}
              </div>
            </div>
          ),
        }
      : null;

  const table = [ExpiryPrice, OpenTime, Duration, CloseTime, Payout, Status];
  table.filter((t) => t);
  return (
    <div className="w-full flex flex-col  gap-y-5 ">
      <div className="flex mt-2 mx-3">
        <button className=" " onClick={() => setInspectedTrade({})}>
          <MemoBackIcon />
        </button>
        <div className="w-fit m-auto scale-[1.40]">
          <AssetCell currentRow={trade} />
        </div>
      </div>
      <div className="mx-3">
        <Head>Net PnL</Head>
        <Display
          label={status.chip == 'Win' ? '+' : ''}
          className={
            '!justify-start !text-[22px]  text-[#C3C2D4] ' + status.textColor
          }
          data={pnl}
          unit={poolInfo.token}
        />{' '}
      </div>
      <div className="flex gap-x-6 mx-3">
        <div>
          <Head className="!text-f12">Trade Size</Head>
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start !text-f14  text-[#C3C2D4]"
            unit={poolInfo.token}
          />
        </div>
        <div>
          <Head className="!text-f12">Trade Strike</Head>
          <StrikePriceComponent
            className={'!text-f14  text-[#C3C2D4]'}
            trade={trade}
            currentOI={currentOi}
            maXOI={maxOi}
          />
          ;
        </div>
      </div>
      <div className="bg-[#17171F] rounded-[5px] p-4">
        <TableAligner
          keyStyle={` !py-[10px] ${keyClassName} !text-left `}
          valueStyle={` !py-[10px] ${valueClasssName} !text-right !w-fit`}
          keysName={table.map((t) => t.key)}
          values={table.map((t) => t.value)}
        />
      </div>
    </div>
  );
};

export { TradeInspect_sm };

const Head: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`${className} text-f14 text-[#808191]`}>{children}</div>
  );
};
