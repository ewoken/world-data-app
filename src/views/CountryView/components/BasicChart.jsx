import React from 'react';
import PropTypes from 'prop-types';

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

import { StatisticType, CountryType } from '../../../utils/types';
import { tickFormatter, displayUnit } from '../../../utils';

function BasicChart(props) {
  const {
    data,
    statistics,
    color,
    perCapita,
    height,
    country,
    referenceCountry,
    withReference,
    extra,
  } = props;
  const statistic = statistics.value;
  const unit = displayUnit(statistic.unit, perCapita);
  const withComparison = withReference && (perCapita || statistic.isIntensive);

  return (
    <div className="BasicChart">
      <ResponsiveContainer height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={false}
            name={country.commonName}
            unit={` ${unit}`}
          />
          {withComparison && (
            <Line
              type="monotone"
              dataKey="reference"
              stroke="red"
              strokeWidth={3}
              dot={false}
              name={referenceCountry.commonName}
              unit={` ${unit}`}
            />
          )}
          {extra && extra(props)}
          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" interval={9} padding={{ left: 5, right: 5 }} />
          <YAxis tickFormatter={tickFormatter} />
          <Tooltip content={props2 => <CustomTooltip {...props2} />} />
          {withComparison && <Legend iconType="circle" />}
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
  height: PropTypes.number.isRequired,
  perCapita: PropTypes.bool.isRequired,
  color: PropTypes.string,
  withReference: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  country: CountryType.isRequired,
  referenceCountry: CountryType.isRequired,
  extra: PropTypes.func,
};

BasicChart.defaultProps = {
  color: '#2c82c9',
  withReference: false,
  extra: null,
};

export default BasicChart;
