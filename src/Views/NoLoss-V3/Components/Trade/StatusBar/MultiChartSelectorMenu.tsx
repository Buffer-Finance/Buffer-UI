import { chartNumberAtom } from '@Views/NoLoss-V3/atoms';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { FourCharts } from '../../SVGs/ChartSelectors/FourCharts';
import { OneChart } from '../../SVGs/ChartSelectors/OneChart';
import { TwoChartHorizontal } from '../../SVGs/ChartSelectors/TwoChartHorizontal';
import { TwoChartsvertical } from '../../SVGs/ChartSelectors/TwoChartsvertical';
import { FourRectanglesSVG } from '../../SVGs/FourRectangle';

const Idx2icon = {
  0: OneChart,
  1: TwoChartHorizontal,
  2: TwoChartsvertical,
  3: FourCharts,
};
const arr = [1, 2.5, 2, 4];

export const MultiChartSelectorMenu: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  const [chartTimes, setChartTimes] = useAtom(chartNumberAtom);
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  if (isMobile) return <></>;

  function closeDropdown() {
    toggleMenu(false);
  }
  return (
    <>
      <button
        type="button"
        ref={ref}
        {...anchorProps}
        className="hover:brightness-125"
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
              key={idx}
            >
              <Icon className="mr-2" /> &nbsp;{Math.floor(s)} Chart
              {s > 1 ? 's' : ''}
            </MenuItem>
          );
        })}
      </ControlledMenu>
    </>
  );
};
