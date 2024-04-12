import { usePoolStats } from '@Views/LpRewards/Hooks/usePoolstats';
import { poolsType } from '@Views/LpRewards/types';
import { maxBy, minBy, sortBy } from 'lodash';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Chain } from 'viem';
import { ChartWrapper } from './ChartWrapper';
import {
  COLORS,
  YAXIS_WIDTH,
  tooltipFormatter,
  tooltipLabelFormatter,
  yaxisFormatter,
} from './helpers';

export function useTradersUSDCData(activeChain: Chain, activePool: poolsType) {
  const { data: closedPositionsData, error } = usePoolStats(
    activeChain,
    activePool
  );
  const loading = !closedPositionsData && !error;
  let ret = null;
  let currentPnlCumulative = 0;
  let currentProfitCumulative = 0;
  let currentLossCumulative = 0;

  const data =
    closedPositionsData && closedPositionsData.length
      ? sortBy(closedPositionsData, (i) => i.timestamp).map((dataItem) => {
          const profit = +dataItem.profit / 1e6;
          const loss = +dataItem.loss / 1e6;
          const profitCumulative = +dataItem.profit / 1e6;
          const lossCumulative = +dataItem.loss / 1e6;
          const pnlCumulative = profitCumulative - lossCumulative;
          const pnl = profit - loss;
          currentProfitCumulative += profit;
          currentLossCumulative -= loss;
          currentPnlCumulative += pnl;
          return {
            profit,
            loss: -loss,
            profitCumulative,
            lossCumulative: -lossCumulative,
            pnl,
            pnlCumulative,
            timestamp: dataItem.timestamp,
            currentPnlCumulative,
            currentLossCumulative,
            currentProfitCumulative,
          };
        })
      : null;

  if (data) {
    // console.log(data,'data')
    const maxProfit = maxBy(data, (item) => item.profit).profit;
    const maxLoss = minBy(data, (item) => item.loss).loss;
    const maxProfitLoss = Math.max(maxProfit, -maxLoss);

    const maxPnl = maxBy(data, (item) => item.pnl).pnl;
    const minPnl = minBy(data, (item) => item.pnl).pnl;
    const maxCurrentCumulativePnl = maxBy(
      data,
      (item) => item.currentPnlCumulative
    ).currentPnlCumulative;
    const minCurrentCumulativePnl = minBy(
      data,
      (item) => item.currentPnlCumulative
    ).currentPnlCumulative;

    const currentProfitCumulative =
      data[data.length - 1].currentProfitCumulative;
    const currentLossCumulative = data[data.length - 1].currentLossCumulative;
    const stats = {
      maxProfit,
      maxLoss,
      maxProfitLoss,
      currentProfitCumulative,
      currentLossCumulative,
      maxCurrentCumulativeProfitLoss: Math.max(
        currentProfitCumulative,
        -currentLossCumulative
      ),

      maxAbsPnl: Math.max(Math.abs(maxPnl), Math.abs(minPnl)),
      maxAbsCumulativePnl: Math.max(
        Math.abs(maxCurrentCumulativePnl),
        Math.abs(minCurrentCumulativePnl)
      ),
    };

    ret = {
      data,
      stats,
    };
  }

  return { ret, loading };
}

export const ProfitLossChart: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const { ret: tradersUSDCData, loading: tradersUSDCLoading } =
    useTradersUSDCData(activeChain, activePool);
  return (
    <ChartWrapper
      loading={tradersUSDCLoading}
      data={tradersUSDCData?.data ?? []}
      //   tooltip={
      //     "The following graph showcases the trader's Profit and Loss (PnL) by exclusively considering the additions and removals made to the pool, while disregarding any protocol fees."
      //   }
    >
      <ResponsiveContainer width="100%" aspect={0.78}>
        <ComposedChart data={tradersUSDCData?.data} syncId="tradersId">
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={tooltipLabelFormatter}
            minTickGap={30}
          />
          <YAxis
            domain={[
              -(tradersUSDCData?.stats?.maxAbsCumulativePnl ?? 0) * 1.05,
              tradersUSDCData?.stats?.maxAbsCumulativePnl ?? 0 * 1.05,
            ]}
            orientation="right"
            yAxisId="right"
            tickFormatter={yaxisFormatter}
            width={YAXIS_WIDTH}
            tick={{ fill: COLORS[4] }}
          />
          <YAxis
            domain={[
              -(tradersUSDCData?.stats.maxAbsPnl ?? 0) * 1.05,
              tradersUSDCData?.stats.maxAbsPnl ?? 0 * 1.05,
            ]}
            tickFormatter={yaxisFormatter}
            width={YAXIS_WIDTH}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
            contentStyle={{ textAlign: 'left' }}
          />
          <Legend />
          <Bar type="monotone" fill={'#FFFFFF'} dataKey="pnl" name="Net PnL">
            {(tradersUSDCData?.data || []).map((item, i) => {
              return (
                <Cell
                  key={`cell-${i}`}
                  fill={item.pnl > 0 ? '#22c761' : '#f93333'}
                />
              );
            })}
          </Bar>
          <Line
            type="monotone"
            strokeWidth={2}
            stroke={COLORS[4]}
            dataKey="currentPnlCumulative"
            name="Cumulative PnL"
            yAxisId="right"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
