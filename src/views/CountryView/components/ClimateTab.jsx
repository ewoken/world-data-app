import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import BasicChart from './BasicChart';
import withCountryStatistics from '../../../HOC/withCountryStatistics';

const statisticCodes = [
  'CO2_INTENSITY_OF_ENERGY',
  'ENERGY_INTENSITY',
  // 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
];

function ClimateTab(props) {
  const { countryCode } = props;
  return (
    <div className="ClimateTab">
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

ClimateTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default ClimateTab;
