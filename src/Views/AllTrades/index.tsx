import {
  PlatformHistory,
  PlatformOngoing,
  PlatfromCancelled,
} from '@Views/TradePage/Views/AccordionTable';
import { useMemo, useState } from 'react';
import { useAllTradesTab } from './useAlltradesTab';
import {
  PlatformOngoing as AbPlatformOngoing,
  PlatformHistory as AbPlatformHistory,
  PlatfromCancelled as AbPlatfromCancelled,
} from '@Views/ABTradePage/Views/AccordionTable';

const tabs = ['active', 'history', 'cancelled'];
const products = ['Up/Down', 'Above/Below'];
export const AllTrades = () => {
  const { setTab, tab } = useAllTradesTab();
  const [activeProduct, setProduct] = useState(products[0]);

  const currentTab = useMemo(() => {
    if (tab !== null) {
      return tab;
    }
    return tabs[0];
  }, [tab]);

  const table = useMemo(() => {
    if (activeProduct.toLowerCase() === 'above/below') {
      if (currentTab.toLowerCase() === 'active') {
        return <AbPlatformOngoing overflow={false} />;
      }
      if (currentTab.toLowerCase() === 'history') {
        return (
          <AbPlatformHistory className="sm:min-w-[800px]" overflow={false} />
        );
      }
      if (currentTab.toLowerCase() === 'cancelled') {
        return <AbPlatfromCancelled overflow={false} />;
      }
    } else if (activeProduct.toLowerCase() === 'up/down') {
      if (currentTab.toLowerCase() === 'active') {
        return <PlatformOngoing overflow={false} />;
      }
      if (currentTab.toLowerCase() === 'history') {
        return (
          <PlatformHistory className="sm:min-w-[800px]" overflow={false} />
        );
      }
      if (currentTab.toLowerCase() === 'cancelled') {
        return <PlatfromCancelled overflow={false} />;
      }
    }
    return <>select a tab</>;
  }, [currentTab, activeProduct]);
  return (
    <div className="w-full">
      <div className="flex gap-3 my-4 mx-5">
        {products.map((product) => {
          const isActiveProduct =
            activeProduct.toLowerCase() === product.toLowerCase();
          return (
            <button
              className={`text-f18 ${
                isActiveProduct ? 'text-1' : 'text-[#808191]'
              } capitalize`}
              key={product}
              onClick={() => setProduct(product)}
            >
              {product}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 my-4 mx-5">
        {tabs.map((tab) => {
          const isActiveTab = tab.toLowerCase() === currentTab.toLowerCase();
          return (
            <button
              className={`text-f18 ${
                isActiveTab ? 'text-1' : 'text-[#808191]'
              } capitalize`}
              key={tab}
              onClick={() => setTab(tab)}
            >
              Platform {tab}
            </button>
          );
        })}
      </div>
      {table}
    </div>
  );
};
export default AllTrades;
