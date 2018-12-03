import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const server = process.env.REACT_APP_WORLD_DATA_STORE;

class StatisticChart extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidUpdate(prevProps) {
    const { countryCode, statisticCode } = this.props;
    if (
      (prevProps.countryCode !== countryCode && countryCode) ||
      (prevProps.statisticCode !== statisticCode && statisticCode)
    ) {
      fetch(`${server}/statistic/${statisticCode}?country=${countryCode}`)
        .then(res => res.json())
        .then(res => this.setState(res));
    }
  }

  render() {
    const { data, unit } = this.state;

    if (!data) {
      return null;
    }

    return (
      <div className="StatisticChart">
        <LineChart width={600} height={300} data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            unit={unit}
            dot={false}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    );
  }
}

StatisticChart.propTypes = {
  countryCode: PropTypes.string,
  statisticCode: PropTypes.string,
};

StatisticChart.defaultProps = {
  countryCode: null,
  statisticCode: null,
};

export default StatisticChart;
