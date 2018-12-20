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

const [
  PopulationChart,
  GDPChart,
  SelfSufficiencyChart,
  CO2EmissionChart,
] = statisticCodes.map(statisticCode =>
  withCountryStatistics({
    value: statisticCode,
  })(BasicChart),
);

function SummaryTab(props) {
  const { countryCode } = props;
  return (
    <div className="SummaryTab">
      <Row gutter={20}>
        <Col md={12} sm={24}>
          <PopulationChart countryCode={countryCode} color="#2c82c9" />
        </Col>
        <Col md={12} sm={24}>
          <GDPChart countryCode={countryCode} color="#f22613" />
        </Col>
        <Col md={12} sm={24}>
          <SelfSufficiencyChart countryCode={countryCode} color="#f15a22" />
        </Col>
        <Col md={12} sm={24}>
          <CO2EmissionChart countryCode={countryCode} color="#6c7a89" />
        </Col>
      </Row>
    </div>
  );
}

SummaryTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default SummaryTab;
