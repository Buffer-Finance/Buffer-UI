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
import FlexLayout, { Layout } from 'flexlayout-react';
import { FavouriteAssetDD } from '@Views/BinaryOptions/Favourites/FavouriteAssetDD';
import { TVMarketSelector } from '@Views/BinaryOptions/Favourites/TVMarketSelector';
import { useToast } from '@Contexts/Toast';
import { CustomOption } from '@Views/BinaryOptions/PGDrawer/CustomOption';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { ActiveAsset } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';

const Test: React.FC<any> = ({}) => {
  return (
    <div className="flex flex-col ">
      <TradingChart market="BTCUSD" />
      <TradingChart market="ETHUSD" />
    </div>
  );
};
var json = {
  global: { tabEnableClose: false },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      size: 100,
      children: [
        {
          type: 'tab',
          name: 'four',
          component: 'text',
        },
      ],
    },
    {
      type: 'border',
      location: 'left',
      size: 100,
      children: [],
    },
  ],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        selected: 0,
        children: [
          {
            type: 'tab',
            name: 'ETHUSD',
            id: 'ETHUSD',
            component: 'TradingView',
          },
          {
            type: 'tab',
            name: '+',
            component: 'AddButton',
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
            name: 'GBPUSD',
            id: 'GBPUSD',
            component: 'TradingView',
          },
          {
            type: 'tab',
            name: 'BuyTrade',
            id: 'BuyTrade',
            component: 'BuyTrade',
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
            name: 'BTCUSD',
            id: 'BTCUSD',
            component: 'TradingView',
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
  const factory = (node) => {
    var component = node.getComponent();
    console.log(`component: `, component);
    if (component === 'TradingView') {
      return <TradingChart market={node.getName()} />;
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
