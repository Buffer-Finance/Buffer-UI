import { StatsContainer } from '../Styles';
import { poolsType } from '../types';
import { DataColumn, defaultDataStyle } from './DataColumn';

export const PoolStats: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  return (
    <StatsContainer>
      <DataColumn
        title="TVL"
        value={<span className={defaultDataStyle}>3,025,444</span>}
      />
      <DataColumn
        title="Lock Period"
        value={<span className={defaultDataStyle}>2 days</span>}
      />
      <DataColumn
        title="Current APR"
        value={<span className={defaultDataStyle}>120%</span>}
      />
      <DataColumn
        title="uBLP Price"
        value={<span className={defaultDataStyle}>1.05</span>}
      />
      <DataColumn
        title="Accumulated PnL"
        value={<span className={`text-green ` + defaultDataStyle}>39.05</span>}
      />
    </StatsContainer>
  );
};
