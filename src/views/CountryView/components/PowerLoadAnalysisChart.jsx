import React from 'react';
import PropTypes from 'prop-types';
import regression from 'regression';
import { range } from 'ramda';

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
import { tickFormatter, formatNumber } from '../../../utils';

const RESOLUTION = 20;

function PowerLoadAnalysisChart(props) {
  const { data, color, statistics } = props;

  const finalData = data.filter(d => d.generation && d.capacity);
  const array = finalData.map(({ capacity, generation }) => [
    capacity,
    generation,
  ]);
  const { equation, r2 } = regression.linear(array);
  const powerLoad = ((equation[0] * 10 ** 3) / (365.25 * 24)) * 100;

  const min = Math.min(...finalData.map(d => d.capacity));
  const max = Math.max(...finalData.map(d => d.capacity));
  const data2 = range(0, RESOLUTION + 1).map(i => {
    const capacity = min + (i / RESOLUTION) * (max - min);
    return {
      capacity,
      generation: equation[0] * capacity + equation[1],
    };
  });

  return (
    <div className="PowerLoadAnalysisChart">
      <ResponsiveContainer height={300}>
        <ScatterChart data={finalData} margin={{ bottom: 50 }}>
          <Scatter data={data2} line={{ stroke: 'grey' }} shape={() => null} />
          <Scatter
            fill={color}
            shape={props2 => (
              <circle cx={props2.cx} cy={props2.cy} r={3} fill={color} />
            )}
            line
          />
          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis
            dataKey="capacity"
            name={statistics.capacity.name}
            type="number"
            tickFormatter={tickFormatter}
            label={{
              value: `${statistics.capacity.name} (${
                statistics.capacity.unit.main
              })`,
              position: 'bottom',
              style: { fill: '#666' },
            }}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis
            dataKey="generation"
            name={statistics.generation.name}
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
                  '0': statistics.capacity.unit.main,
                  '1': statistics.generation.unit.main,
                }}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p>{`Average power load: ${formatNumber(powerLoad)} % (R²=${r2})`}</p>
    </div>
  );
}

PowerLoadAnalysisChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      capacity: PropTypes.number,
      generation: PropTypes.number,
    }),
  ).isRequired,
  statistics: PropTypes.shape({
    capacity: StatisticType,
    generation: StatisticType,
  }).isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
};

PowerLoadAnalysisChart.defaultProps = {
  color: '#2c82c9',
};

export default PowerLoadAnalysisChart;
