import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { StatisticType } from '../../../utils/types';
import CustomTooltip from './CustomTooltip';

const DEFAULT_AREA_PROPS = {
  type: 'monotone',
  dot: false,
  unit: '%',
  activeDot: false,
  strokeOpacity: 0,
  fillOpacity: 0.8,
  stackId: '1',
};

const AREA_PROPS = {
  coal: {
    name: 'Coal',
    dataKey: 'coal',
    stroke: 'black',
    fill: 'black',
  },
  oil: {
    name: 'Oil',
    dataKey: 'oil',
    stroke: 'grey',
    fill: 'grey',
  },
  gas: {
    name: 'Gas',
    dataKey: 'gas',
    stroke: 'orange',
    fill: 'orange',
  },
};
const FUELS = Object.keys(AREA_PROPS);

function RentsChart(props) {
  const { data, height } = props;
  const displayedFuel = FUELS.filter(fuel => data.some(d => d[fuel] > 0.1));

  return (
    <div className="RentsChart">
      <ResponsiveContainer height={height}>
        <ComposedChart data={data}>
          {displayedFuel.map(fuel => (
            <Area {...DEFAULT_AREA_PROPS} {...AREA_PROPS[fuel]} />
          ))}
          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" interval={9} />
          <YAxis />
          <Tooltip
            content={props2 => <CustomTooltip {...props2} withTotal />}
            displayFilter={({ dataKey }) => displayedFuel.includes(dataKey)}
          />
          <Legend iconType="circle" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

RentsChart.propTypes = {
  statistics: PropTypes.shape({
    coal: StatisticType.isRequired,
    oil: StatisticType.isRequired,
    gas: StatisticType.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      coal: PropTypes.number,
      oil: PropTypes.number,
      gas: PropTypes.number,
    }),
  ).isRequired,
  height: PropTypes.number.isRequired,
};

export default RentsChart;
