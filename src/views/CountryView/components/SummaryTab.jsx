import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import BasicChart from './BasicChart';
import withCountryStatistics from '../../../HOC/withCountryStatistics';

const statisticCodes = [
  'POPULATION',
  'GDP_2010_USD',
  'ENERGY_SELF_SUFFICIENCY',
  'CO2_EMISSIONS_MT',
];

function SummaryTab(props) {
  const { countryCode } = props;
  return (
    <div className="SummaryTab">
      <Row gutter={20}>
        {statisticCodes.map(statisticCode => {
          const StatisticContainer = withCountryStatistics({
            value: statisticCode,
          })(BasicChart);

          return (
            <Col md={12} sm={24}>
              <StatisticContainer countryCode={countryCode} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

SummaryTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default SummaryTab;
