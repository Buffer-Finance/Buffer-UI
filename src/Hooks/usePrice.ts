import { parsewsmsg } from "@TV/utils";
import { atom, useSetAtom } from "jotai";
import useWebSocket from "react-use-websocket";
import { Market2Prices } from "src/Types/Market";

export const  usePrice = ()=> {
    const setPrice = useSetAtom(priceAtom);
    useWebSocket('wss://oracle-v2.buffer.finance', {
      onMessage: (price) => {
        const priceUpdates = parsewsmsg(price.data);
        console.log(`priceUpdates: `,priceUpdates);
        setPrice(priceUpdates);
      },
    });
  }

  

export const priceAtom = atom<Partial<Market2Prices>>({});
