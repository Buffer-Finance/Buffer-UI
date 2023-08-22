import DDArrow from '@SVG/Elements/Arrow';
import DDIcon from '@SVG/Elements/DDIcon';
import { History } from '@Views/TradePage/Views/AccordionTable';
import { tradeInspectMobileAtom } from '@Views/TradePage/atoms';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { TradeInspect_sm } from './TradeInspect_sm';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { ShareModal } from '@Views/TradePage/Views/AccordionTable/ShareModal';
import ShutterProvider, {
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';

const TradeLog_sm: React.FC<any> = ({}) => {
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  const markets = useMarketsConfig();
  function closeDropdown() {
    toggleMenu(false);
  }
  const inspectedTrade = useAtomValue(tradeInspectMobileAtom);

  if (!markets?.length) {
    return <div>Loading..</div>;
  }
  const { closeShutter } = useShutterHandlers();
  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);

  const essntials = (
    <>
      <ShutterProvider activeAssetPrice="222" />
      <ShareModal />
    </>
  );
  if (inspectedTrade.trade) {
    return (
      <>
        {essntials}
        <TradeInspect_sm />
      </>
    );
  }
  return (
    <main>
      {essntials}
      <button
        type="button"
        className="flex items-center  text-f14 text-1 !bg-[#232334] m-3 rounded-md px-4 py-2"
        ref={ref}
        {...anchorProps}
      >
        History <DDArrow className=" scale-150 ml-4" />
      </button>
      <ControlledMenu
        {...menuState}
        anchorRef={ref}
        onClose={closeDropdown}
        viewScroll="initial"
        direction="bottom"
        position="anchor"
        align="end"
        portal
        menuClassName={'!p-[0] !rounded-[10px] hover:!rounded-[10px]'}
        offsetY={10}
      >
        <MenuItem
          className={({ hover }) => {
            return `!p-[0] ${hover ? '!rounded-[10px]' : ''}`;
          }}
          onClick={(e: ClickEvent) => {
            e.keepOpen = true;
          }}
        ></MenuItem>
      </ControlledMenu>
      <History onlyView={[0, 6, 7, 8]} />
    </main>
  );
};

export { TradeLog_sm };
