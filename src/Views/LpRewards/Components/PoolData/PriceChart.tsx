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
} from './helpers';

export const PriceChart: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const [glpData, glpLoading, glpError, glpStats] = useBlpData(
    activeChain,
    activePool
  );

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
              domain={[glpStats?.minRate * 0.95, glpStats?.maxRate * 1.05]}
              tickFormatter={(value) => value.toFixed(3)}
              width={YAXIS_WIDTH}
              color="#A0A3C4"
            />
            <Tooltip
              formatter={tooltipFormatterNumber}
              labelFormatter={tooltipLabelFormatter}
              contentStyle={{ textAlign: 'left', fontWeight: 'bold' }}
            />
            <Legend />
            <Line
              isAnimationActive={false}
              type="monotone"
              unit="$"
              strokeWidth={2}
              stroke={'#8884ff'}
              dataKey="rate"
              name="Exchange Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
};
