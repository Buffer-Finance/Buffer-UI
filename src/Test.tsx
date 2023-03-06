import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import useWebSocket from 'react-use-websocket';
import { Market2Prices, Markets } from './Types/Market';
import ReplayIcon from '@mui/icons-material/Replay';
import { TradingChart } from './TradingView';
import { usePrice } from '@Hooks/usePrice';
import FlexLayout, { Layout, TabNode } from 'flexlayout-react';
import { FavouriteAssetDD } from '@Views/BinaryOptions/Favourites/FavouriteAssetDD';
import { TVMarketSelector } from '@Views/BinaryOptions/Favourites/TVMarketSelector';
import { useToast } from '@Contexts/Toast';
import { CustomOption } from '@Views/BinaryOptions/PGDrawer/CustomOption';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { ActiveAsset } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import PGTables from '@Views/BinaryOptions/Tables';
import { ActiveTable, CancelTable, HistoryTable } from '@Views/BinaryOptions';
import { usePastTradeQuery } from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { atomWithLocalStorage } from '@Views/BinaryOptions/PGDrawer';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
var json = {
  global: { tabEnableClose: true },
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'row',
        weight: 1000,
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            id: 'charts',
            children: [
              {
                type: 'tab',
                name: 'BTC-USD',
                id: 'BTC-USD',
                enableClose: false,
                component: 'TradingView',
                enableDrag: false,
              },
            ],
          },
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                type: 'tab',
                name: 'Active',
                id: 'ActiveTable',
                component: 'ActiveTable',
                enableClose: false,
              },
              {
                type: 'tab',
                name: 'History',
                id: 'HistoryTable',
                component: 'HistoryTable',
                enableClose: false,
              },
              {
                type: 'tab',
                name: 'Cancelled',
                id: 'CancelledTable',
                component: 'CancelledTable',
                enableClose: false,
              },
            ],
          },
        ],
      },
      {
        type: 'row',
        weight: 250,
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                enableClose: false,
                type: 'tab',
                name: 'Trade',
                enableDrag: false,
                id: 'BuyTraded',
                component: 'BuyTrade',
              },
            ],
          },
        ],
      },
    ],
  },
};
const layoutAtom = atomWithLocalStorage('Layout-v100', json);
const DesktopTrade = () => {
  const layoutRef = useRef<Layout | null>(null);
  const { market } = useParams();
  const [layout, setLayout] = useAtom(layoutAtom);
  const layoutApi = useMemo(() => FlexLayout.Model.fromJson(layout), [layout]);
  const toastify = useToast();
  const navigate = useNavigate();
  usePrice();
  usePastTradeQuery();
  useGenericHooks();

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if (component === 'TradingView') {
      return <TradingChart market={node.getName() as Markets} />;
    }
    if (component === 'AddButton') {
      return (
        <TVMarketSelector
          className="asset-dropdown-wrapper !h-[100%] !justify-start "
          onMarketSelect={handleNewTabClick}
        />
      );
    }
    if (component === 'BuyTrade') {
      return (
        <Background className="bg-2 max-w-[420px] mx-auto">
          <ActiveAsset cb={handleNewTabClick} />
          <CustomOption onResetLayout={() => setLayout(json)} />
        </Background>
      );
    }
    const rect = node.getRect();
    if (component === 'ActiveTable') {
      return <ActiveTable width={rect.width} />;
    }
    if (component === 'HistoryTable') {
      return <HistoryTable width={rect.width} />;
    }
    if (component === 'CancelledTable') {
      return <CancelTable width={rect.width} />;
    }
  };
  function handleNewTabClick(market: string, custom?: string) {
    // try {
    //   if (custom) {
    layoutApi.doAction(FlexLayout.Actions.deleteTab('dd'));
    navigate('/test/' + (market || custom));
    //   } else {
    //     layoutRef.current!.addTabToActiveTabSet({
    //       type: 'tab',
    //       name: market,
    //       component: 'TradingView',
    //       id: market.replace('-', ''),
    //     });
    //     layoutApi.doAction(FlexLayout.Actions.deleteTab('dd'));
    //   }
    // } catch (e) {
    //   if (!custom) {
    //     toastify({
    //       msg: market + ' is already opened in different tab',
    //       type: 'error',
    //       id: e,
    //     });
    //     layoutApi.doAction(FlexLayout.Actions.selectTab(market));
    //   }
    //   console.log('action', e);
    // }
  }
  // useLayoutEffect(() => {
  // if (market && document.getElementById(market!)) {
  // document.getElementById(market!).className = ' !w-[2px] !h-[2px] ';
  // }
  // }, [market]);
  useEffect(() => {
    // console.log(`ddmarket: `, market);
    // document
    //   .querySelectorAll('.flexlayout__tab_button')
    //   .forEach((d) => d.classList.remove('active-tab-tv'));
    // const closest = document
    //   .getElementById(market?.replace('-', ''))
    //   ?.closest('.flexlayout__tab_button');

    // console.log(`closest: `, closest);
    // closest?.classList.add('active-tab-tv');
    try {
      layoutRef.current!.addTabToTabSet('charts', {
        type: 'tab',
        name: market,
        component: 'TradingView',
        id: market,
      });
    } catch (e) {}
    layoutApi.doAction(FlexLayout.Actions.selectTab(market));
  }, [market]);
  return (
    <>
      <FlexLayout.Layout
        onAction={(p) => {
          if (p.type == FlexLayout.Actions.SELECT_TAB) {
            console.log('actionselect', p);
            const market = p.data?.tabNode.replace('-', '');
            if (market && Config.markets?.[market]) {
              console.log(`p.data.tabNode: `, p.data.tabNode);
              navigate('/test/' + p.data.tabNode);
            }
          }
          if (p.type == FlexLayout.Actions.DELETE_TAB) {
            console.log('action', p);
            if (
              p.data.node.toLowerCase() ==
              market?.replace('-', '').toLowerCase()
            ) {
              toastify({
                type: 'error',
                msg: "Can't remove the Active Chart!",
                id: '231',
              });
              return false;
            }
          }
          return p;
        }}
        ref={layoutRef}
        model={layoutApi}
        factory={factory}
        onRenderTab={(d, v) => {
          if (d.getComponent() == 'TradingView') {
            const name = d.getName() as Markets;
            console.log(`name: `, name);
            const market = Config.markets[name.replace('-', '')].pair;
            console.log(`market: `, market);
            v.leading = (
              <div className="w-[20px] h-[20px]" id={market.replace('-', '')}>
                <PairTokenImage pair={market} />
              </div>
            );
          }
        }}
        onRenderTabSet={(d, v) => {
          if (d.getId() === 'charts') {
            // v.headerButtons[0].
            v.stickyButtons.push(
              <button
                className="text-f22"
                onClick={() => {
                  layoutRef.current!.addTabToTabSet('charts', {
                    type: 'tab',
                    name: 'Add Chart',
                    component: 'AddButton',
                    id: 'dd',
                  });
                }}
              >
                +
              </button>
            );
          }
          v.buttons.push(
            <button
              title="Reset layout. You can Drag and Drop to customize the UI."
              className="flex justify-center items-center flip-y !text-2 hover:!bg-[#3d3d3d] rounded-sm "
              onClick={() => setLayout(json)}
            >
              <ReplayIcon />
            </button>
          );
        }}
        onModelChange={(model) => {
          console.log(`model: `, model);
          setLayout(model.toJson());
        }}
      />
    </>
  );

  // onRenderTab={(node,arr)=>{
  //   console.log(`arr: `,arr);
  //   console.log(`node: `,node);
  //   arr.buttons.push(<Tab></Tab>)
  // }}
};

export const priceAtom = atom<Partial<Market2Prices>>({});
export { DesktopTrade };
const Tab = () => {
  <div>Hello i am a tab</div>;
};
