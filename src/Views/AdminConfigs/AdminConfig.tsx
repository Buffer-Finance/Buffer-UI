import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import OptionAbi from '@Views/TradePage/ABIs/OptionContract.json';
import ConfigAbi from '@ABIs/ABI/configABI.json';
import PoolAbi from '@ABIs/ABI/poolABI.json';
import PoolOiAbi from '@ABIs/PoolOiAbi.json';
import BoosterAbi from '@ABIs/BoosterAbi.json';
import MarketOiAbi from '@ABIs/MarketOiAbi.json';
import group2configs from '@Views/AdminConfigs/AdminConfigs.json';
import RouterAbi from '@Views/TradePage/ABIs/RouterABI.json';
import { Abi } from 'viem';
import { useActiveChain } from '@Hooks/useActiveChain';
import { raw2adminConfig } from './helpers';
const group2abi = {
  router: RouterAbi,
  options: OptionAbi,
  options_config: ConfigAbi,
  marketoi: MarketOiAbi,
  booster: BoosterAbi,
  pooloi: PoolOiAbi,
  pool: PoolAbi,
};

const group2marketAddresesMapping = {
  marketoi: 'marketOiContract',
  option_config: 'configContract',
  options: 'optionContract',
};

const marketDependent = Object.keys(group2marketAddresesMapping);

type ipop = 'string' | 'number';
type formaters = { name: string; type: ipop; value: string }[];
type RPCPayloads = {
  name: string;
  op: formaters;
  ip: formaters;
};

type UIConfigValue = {
  abi: Abi;
  getter: RPCPayloads;
  setter: RPCPayloads;
  group: keyof typeof group2abi;
  contract: `0x${string}`;
  mapper: () => void;
};

type AdminConfig = {
  [value in keyof typeof group2abi]: UIConfigValue;
};

// type Groups = keyof typeof group2abi;

type Config = {
  getter: string;
  decimal?: number;
};

const AdminConfig: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  // const { activeChain } = useActiveChain();
  // const adminConfig = raw2adminConfig(group2configs, marketConfig, activeChain);
  // console.log(`ConfigPage-adminConfig: `, adminConfig);

  return <div>Hello</div>;
};

export { AdminConfig };
