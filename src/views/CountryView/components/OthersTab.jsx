import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import PowerLoadAnalysis from './PowerLoadAnalysisChart';
import buildChart from '../../../HOC/buildChart';

const WindLoadChartContainer = buildChart({
  mapOfCountryStatisticsSelector: {
    generation: 'WIND_GENERATION_TWH',
    capacity: 'WIND_CAPACITY_GW',
  },
})(PowerLoadAnalysis);

const SolarLoadChartContainer = buildChart({
  mapOfCountryStatisticsSelector: {
    generation: 'SOLAR_GENERATION_TWH',
    capacity: 'SOLAR_CAPACITY_GW',
  },
})(PowerLoadAnalysis);

function OthersTab(props) {
  const { countryCode } = props;
  return (
    <div className="OthersTab">
      <Row gutter={20}>
        <Col md={8} sm={24}>
          <WindLoadChartContainer countryCode={countryCode} />
        </Col>
        <Col md={8} sm={24}>
          <SolarLoadChartContainer countryCode={countryCode} />
        </Col>
      </Row>
    </div>
  );
}

OthersTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default OthersTab;
