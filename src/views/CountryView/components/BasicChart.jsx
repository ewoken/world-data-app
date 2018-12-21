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
import CustomTooltip from './CustomTooltip';

import { StatisticType } from '../../../utils/types';
import { tickFormatter, displayUnit } from '../../../utils';

function BasicChart(props) {
  const { data, statistics, color, perCapita } = props;
  const statistic = statistics.value;
  const unit = displayUnit(statistic.unit, perCapita);

  return (
    <div className="SelfSufficiency">
      <strong>{`${statistic.name} (${unit})`}</strong>
      <ResponsiveContainer height={200}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={false}
            name={statistic.name}
            unit={` ${unit}`}
          />
          <XAxis dataKey="year" interval={9} padding={{ left: 5, right: 5 }} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip content={CustomTooltip} />
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
  color: PropTypes.string,
  perCapita: PropTypes.bool.isRequired,
};

BasicChart.defaultProps = {
  color: '#2c82c9',
};

export default BasicChart;
