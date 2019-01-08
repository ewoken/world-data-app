import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import BasicChartContainer from '../containers/BasicChartContainer';

function ClimateTab(props) {
  const { countryCode } = props;
  return (
    <div className="ClimateTab">
      <Row gutter={20}>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="FOSSIL_CO2_EMISSIONS_MT"
            perCapita
            countryCode={countryCode}
          />
        </Col>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="PRIMARY_ENERGY_CONSUMPTION_MTOE"
            perCapita
            countryCode={countryCode}
          />
        </Col>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="CO2_INTENSITY_OF_ENERGY"
            countryCode={countryCode}
          />
        </Col>
      </Row>
    </div>
  );
}

ClimateTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default ClimateTab;
