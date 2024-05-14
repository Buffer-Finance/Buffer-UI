import { useState } from 'react';
import { ProductDropDown, Products } from '../ProductDropDown';
import { HistoryTables } from './HistoryTable';

export const Trades = () => {
  const [activeProduct, setActiveProduct] = useState<Products>('Up/Down');
  return (
    <div className="my-7 flex flex-col ">
      <div className="text-f22 mb-7 flex items-center gap-3">
        <span>Trades</span>
        <ProductDropDown
          activeProduct={activeProduct}
          setActiveProduct={setActiveProduct}
        />
      </div>
      <HistoryType type={activeProduct} />
    </div>
  );
};

const HistoryType: React.FC<{ type: Products }> = ({ type }) => {
  switch (type) {
    case 'Up/Down':
      return <HistoryTables />;
    case 'Above/Below':
    //   return <AboveBelowHistory />;
    default:
      return <HistoryTables />;
      return <></>;
  }
};
