import React from 'react';
import PropTypes from 'prop-types';

import {
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

import { StatisticType } from '../../../utils/types';
import { tickFormatter } from '../../../utils';

function GDPByEnergyChart(props) {
  const { data, color, statistics } = props;
  // const statistic = statistics.value;
  // const unit = displayUnit(statistic.unit, perCapita);

  return (
    <div className="GDPByEnergyChart">
      <ResponsiveContainer height={300}>
        <ScatterChart data={data} margin={{ bottom: 50 }}>
          <Scatter
            fill={color}
            shape={props2 => (
              <circle cx={props2.cx} cy={props2.cy} r={3} fill={color} />
            )}
            line
          />
          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis
            dataKey="energy"
            name={statistics.energy.name}
            type="number"
            domain={[
              dataMin => Math.floor(0.95 * dataMin),
              dataMax => Math.ceil(1.05 * dataMax),
            ]}
            tickFormatter={tickFormatter}
            label={{
              value: `${statistics.energy.name} (${
                statistics.energy.unit.main
              })`,
              position: 'bottom',
              style: { fill: '#666' },
            }}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis
            dataKey="gdp"
            name={statistics.gdp.name}
            tickFormatter={tickFormatter}
            padding={{ top: 5 }}
          />
          <Tooltip
            content={props2 => (
              <CustomTooltip
                {...props2}
                label={
                  props2.payload &&
                  props2.payload[0] &&
                  props2.payload[0].payload.year
                }
                units={{
                  '0': statistics.energy.unit.main,
                  '1': statistics.gdp.unit.main,
                }}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

GDPByEnergyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      gdp: PropTypes.number,
      energy: PropTypes.number,
    }),
  ).isRequired,
  statistics: PropTypes.shape({
    gdp: StatisticType,
    energy: StatisticType,
  }).isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
};

GDPByEnergyChart.defaultProps = {
  color: '#2c82c9',
};

export default GDPByEnergyChart;
