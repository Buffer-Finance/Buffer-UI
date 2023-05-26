import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BetState } from '@Hooks/useAheadTrades';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useMemo, useState } from 'react';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import DisplayDate from '@Utils/DisplayDate';
import { divide } from '@Utils/NumString/stringArithmatics';
import routerABI from '@Views/BinaryOptions/ABI/routerABI.json';
import {
  IGQLHistory,
  tardesAtom,
  tardesTotalPageAtom,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { ActiveTabStyles } from '@Views/BinaryOptions/style';
import {
  AssetCell,
  PayoutChip,
  Share,
  SlippageTooltip,
  ExpiryCurrentComponent,
  StrikePriceComponent,
  ProbabilityPNL,
  ErrorMsg,
  StopWatch,
} from '@Views/BinaryOptions/Tables/TableComponents';
import Gradientbtn from '@Views/Common/Buttons';
import TableMobile from '@Views/Common/TableMobile';
import { Display } from '@Views/Common/Tooltips/Display';
import { Variables } from '@Utils/Time';
import { BlackBtn } from '@Views/Common/V2-Button';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { Skeleton } from '@mui/material';
import { priceAtom } from '@Hooks/usePrice';
import { visualizeddAtom } from '@Views/BinaryOptions/Tables/Desktop';
import { getIdentifier } from '@Hooks/useGenericHook';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { useActiveChain } from '@Hooks/useActiveChain';
import { v3AppConfig } from '@Views/V3App/config';

const CancelButton = ({ option }: { option: IGQLHistory }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const { writeCall } = useWriteCall(configData.router, routerABI);

  const cancelHandler = async (
    queuedId: number,
    cb: (loadingState: boolean) => void
  ) => {
    if (queuedId === null || queuedId === undefined) {
      toastify({
        id: 'queuedId',
        type: 'error',
        msg: 'Something went wrong. Please try again later.',
      });
      return true;
    }
    cb(true);
    writeCall(() => cb(false), 'cancelQueuedTrade', [queuedId]);
  };

  if (option && option.queueID !== undefined) return <></>;
  return (
    <BlackBtn
      onClick={() => cancelHandler(Number(option.queueID), setIsLoading)}
      className="!h-fit px-4 py-2 !rounded-md !text-f14 !font-medium !w-fit c-232334 mr-[7px]"
      isLoading={isLoading}
    >
      Cancel
    </BlackBtn>
  );
};

const MobileTable: React.FC<{
  isHistoryTab?: boolean;
  isCancelledTab?: boolean;
  count?: number;
  currentPage?: number;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  activePage: number;
  shouldNotDisplayShareVisulise?: boolean;
}> = ({
  isHistoryTab = false,
  isCancelledTab,
  onPageChange,
  activePage,
  shouldNotDisplayShareVisulise = false,
}) => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);

  const [marketPrice] = useAtom(priceAtom);
  const { active, history, cancelled } = useAtomValue(tardesAtom);
  const filteredData = isHistoryTab
    ? history
    : isCancelledTab
    ? cancelled
    : active;

  const {
    active: activePages,
    history: historyPages,
    cancelled: cancelledPages,
  } = useAtomValue(tardesTotalPageAtom);
  const { state } = useGlobal();
  const { shouldConnectWallet } = useOpenConnectionDrawer();

  const activeTab = state.tabs.activeIdx;

  const isHistoryTable = activeTab === 'History';
  const isCancelledTable = activeTab === 'Cancelled';
  const totalPages = useMemo(() => {
    if (isHistoryTable) {
      return historyPages;
    } else if (isCancelledTable) {
      return cancelledPages;
    } else return activePages;
  }, [activePages, historyPages, cancelledPages, activeTab]);

  const BodyFormatterMobile = (
    row: number,
    selectedIndex: number,
    handleClick: (idx: number) => void
  ) => {
    const option: IGQLHistory = filteredData[row];
    const deposit_token = option.poolInfo.token;
    const normal_option =
      option.state != BetState.queued && option.state != BetState.cancelled;
    const StartDate = {
      name: <>Start Date</>,
      val:
        option.state == BetState.queued ? (
          <>-</>
        ) : (
          <DisplayDate timestamp={+option.creationTime} />
        ),
    };
    const ExpiryDate = {
      name: <>Expiry Date</>,
      val:
        option.state == BetState.queued ? (
          <>-</>
        ) : (
          <DisplayDate timestamp={+option.expirationTime} />
        ),
    };
    const StrikePrice = {
      name: (
        <>
          <div className="flex items-center content-end">
            Strike &nbsp;
            {option.state == BetState.queued && option?.slippage && (
              <>
                ( <Display data={divide(option.slippage, 2)} unit="%" />
                &nbsp; Slippage
                <SlippageTooltip
                  option={option}
                  className="mt-[2px] mr-[3px] ml-[3px]"
                />
                )
              </>
            )}
          </div>
        </>
      ),

      val: (
        <StrikePriceComponent
          trade={option}
          isMobile
          configData={option.configPair}
        />
      ),
    };
    let arr = [StrikePrice];
    if (!isCancelledTab) {
      arr = [StartDate, ExpiryDate, StrikePrice];
    } else {
      arr = [
        ...arr,
        {
          name: <>Queue Time</>,
          val: <DisplayDate timestamp={+option.queueTimestamp} />,
        },
        {
          name: <>Cancellation Time</>,
          val: <DisplayDate timestamp={+option.cancelTimestamp} />,
        },
        { name: <>Reason</>, val: <>{getErrorFromCode(option?.reason)}</> },
      ];
    }
    let visible = false;
    if (
      option.state !== BetState.queued &&
      option.state !== BetState.cancelled
    ) {
      const price = getPriceFromKlines(marketPrice, option.chartData);
      // console.log(`pricedd: `, marketPrice, option.configPair);

      // if (isHistoryTab || price) {
      let additionalInfo = [
        {
          name: (
            <>
              {option.state !== BetState.active
                ? 'Price at Expiry'
                : 'Current Price'}
            </>
          ),
          val:
            isHistoryTab || price ? (
              <ExpiryCurrentComponent
                isHistoryTable={isHistoryTab}
                trade={option}
                marketPrice={marketPrice}
                configData={option.configPair}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                className="!w-[80px] bg-1  !h-[20px]"
              />
            ),
        },

        {
          name: <> {isHistoryTab ? 'Pnl' : 'Probability'}</>,
          val:
            isHistoryTab || price ? (
              <ProbabilityPNL
                isHistoryTable={isHistoryTab}
                trade={option}
                marketPrice={marketPrice}
                onlyPnl
              />
            ) : (
              <Skeleton
                variant="rectangular"
                className="!w-[80px] bg-1  !h-[20px]"
              />
            ),
        },
      ];
      let isPresentInDisabled = visualized.includes(getIdentifier(option));
      const currIdentifier = getIdentifier(option);

      const viz = [
        isCancelledTab || isHistoryTab
          ? null
          : {
              name: <> Visualize</>,
              val: (
                <BufferCheckbox
                  checked={!isPresentInDisabled}
                  onCheckChange={() => {
                    const currIdentifier = getIdentifier(option);
                    if (isPresentInDisabled) {
                      let temp = [...visualized];
                      temp.splice(visualized.indexOf(currIdentifier), 1);
                      setVisualized(temp);
                    } else {
                      setVisualized([...visualized, currIdentifier]);
                    }
                  }}
                />
              ),
            },
      ];
      arr = [...arr, ...additionalInfo, ...viz];
      arr = arr.filter((arr) => arr);
      // if (viz[0]) {
      //   arr = [...arr, ...additionalInfo, ...viz];
      // }

      // }
    }
    if (selectedIndex === row) visible = true;

    return (
      <ActiveTabStyles>
        <div id={row.toString()} className="option">
          <div className="flex-bw">
            <AssetCell currentRow={option} configData={option.configPair} />

            <div className="flex flex-col items-end justify-center">
              <div className="f13 flex gap-2">
                {/* show status on history + queued state */}
                {isHistoryTab || option.state != BetState.active ? (
                  <PayoutChip data={option} />
                ) : null}
                {/* dont show duration in queued | cancelled state */}
                {normal_option ? (isHistoryTab ? 'Duration' : 'Time Left') : ''}
              </div>
              <div className="f14 text-6  ">
                {/* dont show duration in queued | cancelled state */}
                {option.state == BetState.queued ||
                option.state == BetState.cancelled ? (
                  ''
                ) : isHistoryTab ? (
                  formatDistanceExpanded(
                    Variables(+option.expirationTime - +option.creationTime)
                  )
                ) : (
                  <StopWatch expiry={+option.expirationTime} />
                )}
              </div>
            </div>
          </div>

          {/* <VerticalTransition value={visible ? 1 : 0}> */}
          {visible ? (
            <div>
              {arr.map((a) => (
                <DataRow keyName={a.name} value={a.val} />
              ))}
            </div>
          ) : null}
          {/* </VerticalTransition> */}

          <div className="flex-bw mt15">
            <div className="flex flex-row items-start">
              <div className="flex flex-col items-start justify-center">
                <div className="f13 ">Trade Size</div>
                <div className="f14 text-6  ">
                  {option?.totalFee ? (
                    <Display
                      className="justify-endk"
                      data={divide(
                        option.totalFee.toString(),
                        option.poolInfo.decimals
                      )}
                      unit={deposit_token}
                    />
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
            <div className="flex-row flex items-center justify-end">
              {option.state == BetState.queued && (
                <CancelButton option={option} />
              )}
              <div className="flex items-center gap-3">
                {normal_option &&
                  isHistoryTab &&
                  !shouldNotDisplayShareVisulise && <Share data={option} />}
                <Gradientbtn
                  className={`details-btn`}
                  onClick={() => {
                    selectedIndex === row ? handleClick(-1) : handleClick(row);
                  }}
                >
                  Details
                  {visible ? (
                    <ExpandLess className=" arrow scale-90" />
                  ) : (
                    <ExpandMore className=" arrow scale-90" />
                  )}
                </Gradientbtn>
              </div>
            </div>
          </div>
        </div>
      </ActiveTabStyles>
      // </MobileTableStyles>
    );
  };

  return (
    <div>
      <TableMobile
        rows={filteredData?.length}
        bodyJSX={BodyFormatterMobile}
        count={totalPages}
        activePage={activePage}
        onPageChange={onPageChange}
        error={<ErrorMsg isHistoryTable={isHistoryTab} />}
        loading={!shouldConnectWallet && !filteredData}
      />
    </div>
  );
};
export default MobileTable;

export function DataRow({ keyName, value, className = '' }) {
  return (
    <div className={`flex-bw mt15 ${className}`}>
      <div className="f14 text-6">{keyName}</div>
      {Array.isArray(value) ? (
        value.map((v) => <div className="f14 fw6">{v}</div>)
      ) : (
        <div className="f14 fw6">{value}</div>
      )}
    </div>
  );
}
