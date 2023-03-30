import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo, useRef, useState } from 'react';
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
      first: 1000
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
      first: 1000
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
      first: 1000
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
  responseMap.current.set(currentQueryIndex, data);
  console.log(responseMap.current, data, currentQueryIndex, 'responseMap');

  const totalPages = useMemo(() => {
    let totalTrades = {
      historyLength: 0,
      activeLength: 0,
      cancelledLength: 0,
    };

    if (data) {
      if (
        data[`historyLength${currentQueryIndex}`].length === 1000 ||
        data[`activeLength${currentQueryIndex}`].length === 1000 ||
        data[`cancelledLength${currentQueryIndex}`].length === 1000
      ) {
        setCurrentQueryIndex((prv) => prv + 1);
      }

      responseMap.current.forEach((value, key) => {
        totalTrades = {
          historyLength:
            totalTrades.historyLength + value[`historyLength${key}`].length,
          activeLength:
            totalTrades.activeLength + value[`activeLength${key}`].length,
          cancelledLength:
            totalTrades.cancelledLength + value[`cancelledLength${key}`].length,
        };
      });
    }
    return totalTrades;
  }, [data]);
  console.log(totalPages, 'totalPages');
};
