import React from 'react';
import PropTypes from 'prop-types';

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  ResponsiveContainer,
} from 'recharts';
import { StatisticType } from '../../../utils/types';

function BasicChart(props) {
  const { data, statistics } = props;
  const statistic = statistics.value;
  return (
    <div className="SelfSufficiency">
      <strong>{`${statistic.name} (${statistic.unit.main})`}</strong>
      <ResponsiveContainer height={200}>
        <LineChart data={data} margin={{ left: 20, top: 10 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="red"
            dot={false}
            name={statistic.name}
            unit={` ${statistic.unit.main}`}
          />
          <XAxis dataKey="year" interval={9} padding={{ left: 5, right: 5 }} />
          <YAxis
            tickFormatter={v =>
              v > 10 ** 7 ? v.toPrecision(2) : v.toLocaleString()
            }
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

BasicChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      value: PropTypes.number,
    }),
  ).isRequired,
  statistics: PropTypes.shape({
    value: StatisticType,
  }).isRequired,
};

export default BasicChart;
