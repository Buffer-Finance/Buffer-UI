import { parsewsmsg } from "@TV/utils";
import { atom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState }  from "react-use-websocket";
import { Market2Prices } from "src/Types/Market";

export const  usePrice = ()=> {
    const setPrice = useSetAtom(priceAtom);
    const closeRef = useRef<boolean>(false);
    const setWsState = useSetAtom(wsStateAtom);
    const {  readyState } =   useWebSocket('wss://oracle-v2.buffer.finance', {
      onMessage: (price) => {
        const priceUpdates = parsewsmsg(price.data);
        console.log(`priceUpdates: `,priceUpdates);
        setPrice(p=>({...p,...priceUpdates}));
      },
      onError:()=>{
        console.log('[ws]-err')
      },
      onClose:()=>{
        console.log('[ws]-close')
      },
      retryOnError:true,
      reconnectInterval:199,
      shouldReconnect(event) {
          return true;
      },
    });
    useEffect(()=>{
      const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];
      setWsState({state:connectionStatus});
      console.log(`[ws]-readyState: `,readyState);
    },[readyState])
    useEffect(()=>{
      closeRef.current = false;
      return ()=>{
        closeRef.current = true
      }
    },[])
  }

  
export const wsStateAtom = atom<{state:string}>({state:'need-connection'});
export const priceAtom = atom<Partial<Market2Prices>>({});
