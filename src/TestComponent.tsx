import { priceAtom, usePrice } from '@Hooks/usePrice';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useStream } from 'react-fetch-streams';

const TestComponent: React.FC<any> = ({}) => {
  usePrice();
  const price = useAtomValue(priceAtom);
  console.log(`price: `, price);
  document.title = price?.['BTCUSD']?.[0].price;
  return (
    <div>
      <h1 className="text-f20 text-center w-full">
        {price?.['BTCUSD']?.[0].price}
      </h1>
    </div>
  );
};

export { TestComponent };
