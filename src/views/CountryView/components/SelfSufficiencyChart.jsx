import React from 'react';
import PropTypes from 'prop-types';

import { Line, XAxis, Tooltip, LineChart } from 'recharts';

function SelfSufficiencyChart(props) {
  const { data } = props;
  return (
    <div className="SelfSufficiency">
      Self-sufficiency
      <LineChart
        data={data}
        height={100}
        width={300}
        margin={{ left: 20, top: 10 }}
      >
        <Line
          dataKey="value"
          width={3}
          stroke="red"
          name="Self-sufficiency"
          dot={false}
          unit=" %"
        />
        <XAxis dataKey="year" interval={9} />
        <Tooltip />
      </LineChart>
    </div>
  );
}

SelfSufficiencyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      value: PropTypes.number,
    }),
  ).isRequired,
};

export default SelfSufficiencyChart;
