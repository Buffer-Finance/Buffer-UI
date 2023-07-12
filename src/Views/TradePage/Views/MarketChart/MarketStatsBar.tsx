import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { Display } from '@Views/Common/Tooltips/Display';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useAtomValue, useSetAtom } from 'jotai';
import { SVGProps, useRef } from 'react';
import { MarketSelectorDD } from './MarketSelectorDD';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { toFixed } from '@Utils/NumString';
import { priceAtom } from '@Hooks/usePrice';
import { chartNumberAtom } from '@Views/TradePage/atoms';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { getMinimumValue, joinStrings } from '@Views/TradePage/utils';
import { usePriceChange } from '@Views/TradePage/Hooks/usePriceChange';
import { OneDayChange } from '../Markets/AssetSelectorDD/AssetSelectorTable/OneDayChange';
import { CurrentPrice } from '../BuyTrade/ActiveTrades/CurrentPrice';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import NumberTooltip from '@Views/Common/Tooltips';
import { Payout } from './Payout';

const OneChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.429 1.625c.434 0 .785.363.785.813v8.124c0 .45-.35.813-.785.813H1.57a.799.799 0 0 1-.785-.813V2.438c0-.45.35-.813.785-.813H9.43ZM1.57.812C.705.813 0 1.542 0 2.438v8.126c0 .896.705 1.624 1.571 1.624H9.43c.866 0 1.571-.728 1.571-1.624V2.437c0-.896-.705-1.624-1.571-1.624H1.57Z"
    />
  </svg>
);

const TwoChartHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12.188 4.063c0 .449-.364.812-.813.812h-9.75a.812.812 0 0 1-.813-.813V2.438c0-.449.364-.812.813-.812h9.75c.45 0 .813.363.813.813v1.624Zm-.813 1.625c.896 0 1.625-.73 1.625-1.625V2.438c0-.897-.729-1.626-1.625-1.626h-9.75C.729.813 0 1.542 0 2.438v1.626c0 .896.729 1.625 1.625 1.625h9.75ZM13 10.563V8.937c0-.896-.729-1.624-1.625-1.624h-9.75C.729 7.313 0 8.04 0 8.938v1.624c0 .897.729 1.626 1.625 1.626h9.75c.896 0 1.625-.73 1.625-1.626Zm-1.625.812h-9.75a.812.812 0 0 1-.813-.813V8.938c0-.45.364-.813.813-.813h9.75c.45 0 .813.363.813.813v1.624c0 .45-.364.813-.813.813Z"
    />
  </svg>
);
const TwoChartsvertical = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8.916 13.197a.812.812 0 0 1-.81-.816l.037-9.75a.812.812 0 0 1 .815-.81l1.625.007c.45.001.811.366.81.815l-.036 9.75a.812.812 0 0 1-.816.81l-1.625-.006Zm-1.622-.819a1.627 1.627 0 0 0 1.62 1.631l1.624.006a1.626 1.626 0 0 0 1.631-1.62l.036-9.749a1.627 1.627 0 0 0-1.62-1.631l-1.624-.006A1.627 1.627 0 0 0 7.33 2.63l-.036 9.749Zm-4.88 1.607 1.624.006a1.626 1.626 0 0 0 1.631-1.619l.036-9.75A1.627 1.627 0 0 0 4.086.992L2.461.984a1.627 1.627 0 0 0-1.63 1.62l-.037 9.75a1.627 1.627 0 0 0 1.62 1.63Zm-.807-1.628.036-9.75a.812.812 0 0 1 .815-.81l1.625.007c.45.001.811.366.81.815l-.036 9.75a.812.812 0 0 1-.816.81l-1.625-.006a.812.812 0 0 1-.81-.816Z"
    />
  </svg>
);
const FourCharts = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M2.031 1.625a.407.407 0 0 0-.406.406V4.47c0 .223.183.406.406.406H4.47a.407.407 0 0 0 .406-.406V2.03a.407.407 0 0 0-.406-.406H2.03Zm-1.219.406A1.22 1.22 0 0 1 2.032.812h2.437a1.22 1.22 0 0 1 1.218 1.22v2.437A1.22 1.22 0 0 1 4.47 5.687H2.03A1.22 1.22 0 0 1 .812 4.47V2.03Zm1.22 6.094a.407.407 0 0 0-.407.406v2.438c0 .223.183.406.406.406H4.47a.407.407 0 0 0 .406-.406V8.53a.407.407 0 0 0-.406-.406H2.03Zm-1.22.406a1.22 1.22 0 0 1 1.22-1.219h2.437a1.22 1.22 0 0 1 1.218 1.22v2.437a1.22 1.22 0 0 1-1.218 1.219H2.03a1.22 1.22 0 0 1-1.219-1.22V8.532ZM10.97 1.625H8.53a.407.407 0 0 0-.406.406V4.47c0 .223.183.406.406.406h2.438a.407.407 0 0 0 .406-.406V2.03a.407.407 0 0 0-.406-.406ZM8.53.812h2.438a1.22 1.22 0 0 1 1.219 1.22v2.437a1.22 1.22 0 0 1-1.22 1.218H8.532A1.22 1.22 0 0 1 7.312 4.47V2.03A1.22 1.22 0 0 1 8.533.812Zm0 7.313a.407.407 0 0 0-.406.406v2.438c0 .223.183.406.406.406h2.438a.407.407 0 0 0 .406-.406V8.53a.407.407 0 0 0-.406-.406H8.53Zm-1.219.406a1.22 1.22 0 0 1 1.22-1.219h2.437a1.22 1.22 0 0 1 1.219 1.22v2.437c0 .673-.546 1.219-1.22 1.219H8.532a1.22 1.22 0 0 1-1.219-1.22V8.532Z"
    />
  </svg>
);

const Idx2icon = {
  0: OneChart,
  1: TwoChartHorizontal,
  2: TwoChartsvertical,
  3: FourCharts,
};
const MarketStatsBar: React.FC<any> = ({}) => {
  const setChartTimes = useSetAtom(chartNumberAtom);
  const chartTimes = useAtomValue(chartNumberAtom);
  const { activeMarket } = useActiveMarket();
  const { poolDetails, switchPool } = useSwitchPool();
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  const readcallData = useBuyTradeData();
  let maxFee = null;
  let maxOI = null;
  let currentOI = null;
  let payout = null;
  let currentOIinPercent = null;

  const assetPrices = usePriceChange();
  if (readcallData && switchPool && poolDetails) {
    maxFee = divide(
      readcallData?.maxTradeSizes[switchPool?.optionContract] ?? '0',
      poolDetails.decimals
    ) as string;
    maxOI = divide(
      readcallData?.maxOIs[switchPool?.optionContract] ?? '0',
      poolDetails.decimals
    ) as string;
    currentOI = divide(
      readcallData?.currentOIs[switchPool?.optionContract] ?? '0',
      poolDetails.decimals
    ) as string;

    payout = readcallData?.settlementFees[switchPool?.optionContract];

    currentOIinPercent = Number(
      getMinimumValue(
        divide(multiply(currentOI, '100'), maxOI) as string,
        '100'
      )
    );
  }

  if (!activeMarket) {
    return <></>;
  }

  const oneDayChange = (
    assetPrices?.[joinStrings(activeMarket.token0, activeMarket.token1, '')]
      ?.change ?? 0
  ).toFixed(2);

  function closeDropdown() {
    toggleMenu(false);
  }

  const arr = [1, 2.5, 2, 4];
  const data = [
    {
      header: '24 h Change',
      data: (
        <OneDayChange
          oneDayChange={oneDayChange}
          className="text-f12"
          svgClassName="scale-125"
        />
      ),
    },
    {
      header: 'Max Trade Size',
      data: <Display data={maxFee} unit={poolDetails?.token} precision={0} />,
    },
    // {
    //   header: 'Current OI',
    //   data: (
    //     <Display data={currentOI} unit={poolDetails?.token} precision={2} />
    //   ),
    // },
    // {
    //   header: 'Up Payout',
    //   data: <div>{payout}%</div>,
    // },
    // {
    //   header: 'Down Payout',
    //   data: <div>{payout}%</div>,
    // },
    {
      header: 'Payout',
      data: (
        <Payout token0={activeMarket.token0} token1={activeMarket.token1} />
      ),
    },
    {
      header: (
        <div className="flex items-center">
          Max OI:&nbsp;
          <Display data={maxOI} unit={poolDetails?.token} precision={2} />
        </div>
      ),
      data: (
        <NumberTooltip
          content={
            currentOI
              ? `Current OI : ${multiply(currentOI, 2)} ${
                  poolDetails?.token
                } / Max OI : ${maxOI} ${poolDetails?.token} `
              : ''
          }
        >
          <div className="min-w-[160px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={currentOIinPercent ?? 0}
            />
          </div>
        </NumberTooltip>
      ),
    },
  ];

  return (
    <div className="flex p-3 gap-x-[35px] items-center">
      <MarketSelectorDD
        token0={activeMarket.token0}
        token1={activeMarket.token1}
      />
      <MarketPrice token0={activeMarket.token0} token1={activeMarket.token1} />
      {data.map((d) => {
        return (
          <div className="flex flex-col justify-center items-start gap-y-1">
            <span className="text-f12 text-[#82828F]">{d.header}</span>
            <span className="text-f12 w-full">{d.data}</span>
          </div>
        );
      })}
      <button
        type="button"
        ref={ref}
        {...anchorProps}
        className="hover:brightness-125 ml-auto"
      >
        <FourRectanglesSVG />
      </button>
      <ControlledMenu
        {...menuState}
        anchorRef={ref}
        onClose={closeDropdown}
        viewScroll="initial"
        direction="bottom"
        position="initial"
        align="center"
        menuClassName={
          '!p-[0] !rounded-[10px] !bg-[#232334] !py-2 hover:!rounded-[10px]'
        }
        offsetY={10}
      >
        {arr.map((s, idx) => {
          const Icon = (Idx2icon as any)[idx];
          return (
            <MenuItem
              className={({ hover }) => {
                return `  ${
                  chartTimes == s ? 'text-1' : 'text-2'
                } hover:brightness-110 hover:bg-[#232334]  hover:text-1`;
              }}
              onClick={(e: ClickEvent) => {
                // e.keepOpen = true;
                setChartTimes(s);
              }}
            >
              <Icon className="mr-2" /> &nbsp;{Math.floor(s)} Chart
              {s > 1 ? 's' : ''}
            </MenuItem>
          );
        })}
      </ControlledMenu>
    </div>
  );
};

export { MarketStatsBar };

const MarketPrice: React.FC<{ token0: string; token1: string }> = ({
  token0,
  token1,
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-f18">
        <CurrentPrice token0={token0} token1={token1} />
      </span>
    </div>
  );
};

const FourRectanglesSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    {...props}
  >
    <path
      fill="#7F87A7"
      d="M2.594 1.875a.72.72 0 0 0-.719.719v4.312a.72.72 0 0 0 .719.719h4.312a.72.72 0 0 0 .719-.719V2.594a.72.72 0 0 0-.719-.719H2.594Zm-2.156.719c0-1.19.965-2.156 2.156-2.156h4.312c1.19 0 2.157.965 2.157 2.156v4.312c0 1.19-.966 2.157-2.157 2.157H2.594A2.157 2.157 0 0 1 .438 6.905V2.594Zm2.156 10.781a.72.72 0 0 0-.719.719v4.312a.72.72 0 0 0 .719.719h4.312a.72.72 0 0 0 .719-.719v-4.312a.72.72 0 0 0-.719-.719H2.594Zm-2.156.719c0-1.19.965-2.156 2.156-2.156h4.312c1.19 0 2.157.965 2.157 2.156v4.312c0 1.19-.966 2.157-2.157 2.157H2.594a2.157 2.157 0 0 1-2.156-2.157v-4.312ZM18.405 1.875h-4.312a.72.72 0 0 0-.719.719v4.312a.72.72 0 0 0 .719.719h4.312a.72.72 0 0 0 .719-.719V2.594a.72.72 0 0 0-.719-.719ZM14.094.437h4.312c1.19 0 2.157.966 2.157 2.157v4.312c0 1.19-.966 2.157-2.157 2.157h-4.312a2.157 2.157 0 0 1-2.156-2.157V2.594c0-1.19.965-2.156 2.156-2.156Zm0 12.938a.72.72 0 0 0-.719.719v4.312a.72.72 0 0 0 .719.719h4.312a.72.72 0 0 0 .719-.719v-4.312a.72.72 0 0 0-.719-.719h-4.312Zm-2.156.719c0-1.19.965-2.156 2.156-2.156h4.312c1.19 0 2.157.965 2.157 2.156v4.312c0 1.19-.966 2.157-2.157 2.157h-4.312a2.157 2.157 0 0 1-2.156-2.157v-4.312Z"
    />
  </svg>
);
export default FourRectanglesSVG;
