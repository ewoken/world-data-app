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
import { tickFormatter } from '../../../utils/chartHelpers';
import { formatNumber } from '../../../utils';

function CustomTooltip(props) {
  const { active } = props;

  if (active) {
    const { payload, label } = props;
    return (
      <div className="CustomTooltip">
        {payload[0] && (
          <div style={{ lineHeight: '22px', color: payload[0].color }}>
            {`${label} : ${formatNumber(payload[0].value)} ${payload[0].unit}`}
          </div>
        )}
      </div>
    );
  }
  return null;
}
CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  label: PropTypes.string,
};
CustomTooltip.defaultProps = {
  label: '',
};

function BasicChart(props) {
  const { data, statistics, color } = props;
  const statistic = statistics.value;

  return (
    <div className="SelfSufficiency">
      <strong>{`${statistic.name} (${statistic.unit.main})`}</strong>
      <ResponsiveContainer height={200}>
        <LineChart data={data} margin={{ left: 20, top: 10 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={false}
            name={statistic.name}
            unit={` ${statistic.unit.main}`}
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
};

BasicChart.defaultProps = {
  color: '#2c82c9',
};

export default BasicChart;
