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

const MarketStatsBar: React.FC<any> = ({}) => {
  const setChartTimes = useSetAtom(chartNumberAtom);
  const { activeMarket } = useActiveMarket();
  const { poolDetails, switchPool } = useSwitchPool();
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  function closeDropdown() {
    toggleMenu(false);
  }

  const data = [
    {
      header: 'Max Trade Size',
      data: <Display data={switchPool?.max_fee} unit={poolDetails?.token} />,
    },
    {
      header: 'Current OI',
      data: (
        <Display data={switchPool?.openInterest} unit={poolDetails?.token} />
      ),
    },
    {
      header: 'Max OI',
      data: '67 USDC',
    },
    {
      header: 'Payout',
      data: <div>57.4</div>,
    },
  ];

  if (!activeMarket) {
    return <></>;
  }

  const arr = [1, 2, 4];
  return (
    <div className="flex p-3 gap-x-[35px] items-center">
      <MarketSelectorDD
        token0={activeMarket.token0}
        token1={activeMarket.token1}
      />
      <MarketPrice token0={activeMarket.token0} token1={activeMarket.token1} />
      {data.map((d) => {
        return (
          <div className="flex flex-col justify-center items-center gap-y-1">
            <span className="text-f12 text-[#82828F]">{d.header}</span>
            <span className="text-f12">{d.data}</span>
          </div>
        );
      })}
      <button
        type="button"
        ref={ref}
        {...anchorProps}
        className="hover:brightness-125"
      >
        <FourRectanglesSVG />
      </button>
      <div>
        <ControlledMenu
          {...menuState}
          anchorRef={ref}
          onClose={closeDropdown}
          viewScroll="initial"
          direction="bottom"
          position="initial"
          align="center"
          menuClassName={'!p-[0] !rounded-[10px] hover:!rounded-[10px]'}
          offsetY={10}
        >
          {arr.map((s) => (
            <MenuItem
              className={({ hover }) => {
                return ` text-2 hover:brightness-110 !bg-2 hover:text-1`;
              }}
              onClick={(e: ClickEvent) => {
                // e.keepOpen = true;
                setChartTimes(s);
              }}
            >
              {s} Charts
            </MenuItem>
          ))}
        </ControlledMenu>
      </div>
    </div>
  );
};

export { MarketStatsBar };

export const chartNumberAtom = atomWithLocalStorage('hello', 1);

const MarketPrice: React.FC<{ token0: string; token1: string }> = ({
  token0,
  token1,
}) => {
  const marketPrice = useAtomValue(priceAtom);
  const { getChartMarketData } = useChartMarketData();
  const chartData = getChartMarketData(token0, token1);
  const price = toFixed(
    getPriceFromKlines(marketPrice, chartData),
    chartData.price_precision.toString().length - 1
  );

  return (
    <div className="flex flex-col">
      <span className="text-f18">{price}</span>
      <Display className="text-f12" colored data={24.2} />
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
