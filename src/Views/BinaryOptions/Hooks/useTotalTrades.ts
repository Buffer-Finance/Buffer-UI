import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

function getQuery(queryNumber: number, account: string, currentTime: number) {
  return `{ 
   meta${queryNumber} :_meta {
      block {
        number
      }
    }
    historyLength${queryNumber}: userOptionDatas(
      orderBy: expirationTime
      orderDirection: desc
      first: 10000
      where: {
        user_: {address: "${account}"},
        state_in: [1,2,3],
        expirationTime_lt: ${currentTime}
      }
    ){ 
        queuedTimestamp  
    }
     activeLength${queryNumber}: userOptionDatas(
      orderBy: creationTime
      orderDirection: desc
      first: 10000
      where: {
        user_: {address: "${account}"},
        state_in: [1],
        expirationTime_gt: ${currentTime}
      }
    ){
        queuedTimestamp
    }

     cancelledLength${queryNumber}: queuedOptionDatas(
      orderBy: queueID
      orderDirection: desc
      first: 10000
      where: {
        user_: {address: "${account}"},
        state_in: [5],
      }
    ){
      queuedTimestamp
    }
  }`;
}

const useTotalTradesFetch = (
  key: string,
  currentQueryIndex: number,
  account: string,
  currentTime: number
) => {
  const { configContracts } = useActiveChain();
  return useSWR(key, {
    fetcher: async () => {
      const query = getQuery(currentQueryIndex, account, currentTime);
      const response = await axios.post(configContracts.graph.LITE, {
        query,
      });
      return response.data?.data;
    },
    refreshInterval: 300,
  });
};

export const useTotalTrades = ({
  account,
  currentTime,
}: {
  account: string;
  currentTime: number;
}) => {
  const [currentQueryIndex, setCurrentQueryIndex] = useState(1);
  const responseMap = useRef(new Map());

  const key = useMemo(
    () =>
      `history-thegraph-totalPages-account-${account}-currentQueryIndex-${currentQueryIndex}`,
    [currentQueryIndex, account]
  );

  const { data } = useTotalTradesFetch(
    key,
    currentQueryIndex,
    account,
    currentTime
  );

  useEffect(() => {
    if (data) {
      if (
        data[`historyLength${currentQueryIndex}`].length === 1000 ||
        data[`activeLength${currentQueryIndex}`].length === 1000 ||
        data[`cancelledLength${currentQueryIndex}`].length === 1000
      ) {
        setCurrentQueryIndex((prv) => prv + 1);
      }
      const lastValue = responseMap.current.get(currentQueryIndex - 1);

      if (lastValue) {
        responseMap.current.set(currentQueryIndex, {
          historyLength:
            lastValue.historyLength +
            data[`historyLength${currentQueryIndex}`].length,
          activeLength:
            lastValue.activeLength +
            data[`activeLength${currentQueryIndex}`].length,
          cancelledLength:
            lastValue.cancelledLength +
            data[`cancelledLength${currentQueryIndex}`].length,
        });
      } else {
        responseMap.current.set(currentQueryIndex, {
          historyLength: data[`historyLength1`].length,
          activeLength: data[`activeLength1`].length,
          cancelledLength: data[`cancelledLength1`].length,
        });
      }
    }
  }, [data]);
  console.log(responseMap.current, 'totalPages');
};
