import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useState } from 'react';
import hexToRgba from 'hex-to-rgba';

export const Chart = ({ bfrDistributionData }) => {
  const [bfrActiveIndex, setBFRActiveIndex] = useState(null);

  const onBFRDistributionChartEnter = (_, index) => {
    setBFRActiveIndex(index);
  };

  const onBFRDistributionChartLeave = (_, index) => {
    setBFRActiveIndex(null);
  };

  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      return (
        <div className="stats-label">
          <div
            className="stats-label-color"
            style={{ backgroundColor: payload[0].color }}
          ></div>
          {payload[0].value}% {payload[0].name}
        </div>
      );
    }

    return null;
  };

  return (
    <PieChart width={210} height={210}>
      <Pie
        data={bfrDistributionData}
        cx={100}
        cy={100}
        innerRadius={73}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        paddingAngle={2}
        onMouseEnter={onBFRDistributionChartEnter}
        onMouseOut={onBFRDistributionChartLeave}
        onMouseLeave={onBFRDistributionChartLeave}
      >
        {bfrDistributionData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color}
            style={{
              filter:
                bfrActiveIndex === index
                  ? `drop-shadow(0px 0px 6px ${hexToRgba(entry.color, 0.7)})`
                  : 'none',
              cursor: 'pointer',
            }}
            stroke={entry.color}
            strokeWidth={bfrActiveIndex === index ? 1 : 1}
          />
        ))}
      </Pie>
      <text
        x={'50%'}
        y={'50%'}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-f15"
      >
        Distribution
      </text>
      <Tooltip
        content={
          <CustomTooltip payload={bfrDistributionData[bfrActiveIndex]} />
        }
      />
    </PieChart>
  );
};
