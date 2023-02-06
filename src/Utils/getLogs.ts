import { Interface } from "ethers/lib/utils";
import { Provider } from "@wagmi/core";
export interface RawLog {
  topics: Array<string>;
  data: string;
  transactionIndex: number;
  logIndex: number;
  blockNumber: number;
  address: string;
}
export interface Log {
  topic: string;
  args: string;
  blockNumber: number;
  address: string;
}
const generateEventData = (ifc, log: RawLog) => {
  try {
    const parsedLog = ifc.parseLog(log);
    const structuredLog = {
      name: parsedLog.name,
      args: parsedLog.args,
      topic: parsedLog.topic,
      address: log.address,
      blockNumber: log.blockNumber,
    };
    return structuredLog;
  } catch (err) {
  }
};

export const getLogs = async (passedFilters: {
  ifcs: Interface[];
  events: { [eventName: string]: number };
  restTopics: string[];
  fromBlock: number;
  provider: Provider;
  toBlock?: number;
}) => {
  let topics = Object.keys(passedFilters.events);
  let filters: any = {
    topics: [topics, ...passedFilters.restTopics],
    fromBlock: passedFilters.fromBlock,
  };
  if (passedFilters.toBlock) {
    filters.toBlock = passedFilters.toBlock;
  }
  const encodedData: RawLog[] = await passedFilters.provider.getLogs(filters);
  let decodedLogs: { [eventName: string]: Log[] } = {};
  encodedData.forEach((log) => {
    const ifcIdx = passedFilters.events[log.topics[0]];
  
    const ifc = passedFilters.ifcs[ifcIdx];
    const eventData = generateEventData(ifc, log);
    if (decodedLogs[log.topics[0]]) decodedLogs[log.topics[0]].push(eventData);
    else {
      decodedLogs[log.topics[0]] = [eventData];
    }
  });
  return decodedLogs;
};
