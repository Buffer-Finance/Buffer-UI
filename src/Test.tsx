import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import { useEffect, useState } from 'react';
const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];
import { atom, useAtomValue, useSetAtom } from 'jotai';
import useWebSocket from 'react-use-websocket';
import { Market2Prices, Markets } from './Types/Market';
import { TradingChart } from './TradingView';
import { usePrice } from '@Hooks/usePrice';
import FlexLayout from 'flexlayout-react';

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
            name: 'GBPUSD',
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
            name: 'BTCUSD',
            component: 'TradingView',
          },
        ],
      },
    ],
  },
};

const Man = () => {
  const [layout, setLayout] = useState(FlexLayout.Model.fromJson(json));
  usePrice();
  const factory = (node) => {
    var component = node.getComponent();
    console.log(`component: `,component);
    if (component === 'TradingView') {
      return <TradingChart market={node.getName()} />;
    }
  };


  return <FlexLayout.Layout model={layout} factory={factory}
  
  
  // onRenderTab={(node,arr)=>{
  //   console.log(`arr: `,arr);
  //   console.log(`node: `,node);
  //   arr.buttons.push(<Tab></Tab>)
  // }}
  />;
};


export const priceAtom = atom<Partial<Market2Prices>>({});
export { Man as Test };
const Tab = ()=>{
  <div>Hello i am a tab</div>
}