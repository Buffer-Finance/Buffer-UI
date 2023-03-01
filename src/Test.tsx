import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import { useEffect, useRef, useState } from 'react';
const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];
import { atom, useAtomValue, useSetAtom } from 'jotai';
import useWebSocket from 'react-use-websocket';
import { Market2Prices, Markets } from './Types/Market';
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
                name: 'BTCUSD',
                id: 'BTCUSD',
                enableClose: false,
                component: 'TradingView',
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
                type: 'tab',
                name: 'Trade',
                id: 'BuyTrade',
                component: 'BuyTrade',
                enableClose: false,
              },
            ],
          },
        ],
      },
    ],
  },
};

const Man = () => {
  const layoutRef = useRef<Layout | null>(null);
  const [layout, setLayout] = useState(FlexLayout.Model.fromJson(json));
  const toastify = useToast();
  usePrice();
  usePastTradeQuery();

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    console.log(`component: `, component);
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
        <Background className="bg-2">
          <ActiveAsset />
          <CustomOption />
        </Background>
      );
    }
    const rect = node.getRect();
    console.log(` rect: `, rect);
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
  function handleNewTabClick(market: string) {
    console.log(`market: `, market);
    try {
      layoutRef.current!.addTabToActiveTabSet({
        type: 'tab',
        name: market,
        component: 'TradingView',
        id: market,
      });
    } catch (e) {
      toastify({
        msg: market + ' is already opened in different tab',
        type: 'error',
        id: e,
      });
      console.log('action', e);
    }
  }

  return (
    <>
      <FlexLayout.Layout
        onAction={(p) => {
          console.log('action', p);
          return p;
        }}
        ref={layoutRef}
        model={layout}
        factory={factory}
        onRenderTab={(d, v) => {
          // v.buttons.p
        }}
        onRenderTabSet={(d, v) => {
          if (d.getId() === 'charts') {
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
export { Man as Test };
const Tab = () => {
  <div>Hello i am a tab</div>;
};
