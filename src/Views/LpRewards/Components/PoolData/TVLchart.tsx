import { useBlpData } from '@Views/LpRewards/Hooks/useBLPdata';
import { poolsType } from '@Views/LpRewards/types';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Chain } from 'viem';
import { ChartWrapper } from './ChartWrapper';
import {
  YAXIS_WIDTH,
  tooltipFormatterNumber,
  tooltipLabelFormatter,
  yaxisFormatter,
} from './helpers';

export const TVLChart: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const [glpData, glpLoading, glpError, glpStats] = useBlpData(
    activeChain,
    activePool
  );
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  return (
    <div className="text-[#A0A3C4] text-f12 w-[600px] mt-6">
      <ChartWrapper loading={glpLoading && glpData === null} data={glpData}>
        <ResponsiveContainer width={'100%'} aspect={2}>
          <LineChart data={glpData} className="p-2">
            <CartesianGrid strokeDasharray="10 10" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={tooltipLabelFormatter}
              minTickGap={30}
              color="#A0A3C4"
            />
            <YAxis
              dataKey="rate"
              domain={[0, glpStats?.maxGlpAmount * 1.05]}
              tickFormatter={yaxisFormatter}
              width={YAXIS_WIDTH}
              color="#A0A3C4"
            />
            <Tooltip
              formatter={tooltipFormatterNumber}
              labelFormatter={tooltipLabelFormatter}
              contentStyle={{ textAlign: 'left' }}
            />
            <Legend />
            <Line
              isAnimationActive={false}
              type="monotone"
              unit={unit}
              strokeWidth={2}
              stroke={'#8884ff'}
              dataKey="glpSupply"
              name="Amount Of USDC In Pool"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
};
