import { Interface } from 'ethers/lib/utils';
import { PublicClient, getAddress, parseAbiItem } from 'viem';
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
  } catch (err) {}
};

export const getLogs = async (passedFilters: {
  ifcs: Interface[];
  events: { [eventName: string]: number };
  restTopics: string[];
  fromBlock: number;
  client: PublicClient;
  toBlock?: number;
  routerAddress: string;
}) => {
  let topics = Object.keys(passedFilters.events);
  let filters: any = {
    topics: [topics, ...passedFilters.restTopics],
    fromBlock: passedFilters.fromBlock,
  };
  if (passedFilters.toBlock) {
    filters.toBlock = passedFilters.toBlock;
  }

  const createLogs = await passedFilters.client.getLogs({
    event: parseAbiItem(
      'event Create(address indexed account, uint256 id, uint256 tournamentId, uint256 settlementFee, uint256 totalFee)'
    ),
    fromBlock: BigInt(passedFilters.fromBlock),
  });
  const routerLogs = await passedFilters.client.getLogs({
    address: getAddress(passedFilters.routerAddress),
    fromBlock: BigInt(passedFilters.fromBlock),
  });
  const encodedData = [...createLogs, ...routerLogs];
  // console.log(`encodedData: `, encodedData);
  let decodedLogs: { [eventName: string]: Log[] } = {};
  encodedData.forEach((log) => {
    if (
      log.topics[1]?.toLowerCase() != passedFilters.restTopics[0].toLowerCase()
    )
      return;
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
