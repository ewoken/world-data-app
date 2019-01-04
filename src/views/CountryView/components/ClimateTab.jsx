import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import BasicChartContainer from '../containers/BasicChartContainer';

const statisticCodes = [
  'CO2_EMISSIONS_MT',
  'CO2_INTENSITY_OF_ENERGY',
  'ENERGY_INTENSITY',
  // 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
];

function ClimateTab(props) {
  const { countryCode } = props;
  return (
    <div className="ClimateTab">
      <Row gutter={20}>
        {statisticCodes.map(statisticCode => (
          <Col key={statisticCode} md={24 / statisticCodes.length} sm={24}>
            <BasicChartContainer
              statisticCode={statisticCode}
              countryCode={countryCode}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

ClimateTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default ClimateTab;
