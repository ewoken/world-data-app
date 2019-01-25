import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import BasicChartContainer from '../containers/BasicChartContainer';

function ReservesAndPeaksTab(props) {
  const { countryCode, referenceCountryCode, fuelProduced } = props;
  return (
    <div className="ReservesAndPeaksTab">
      <Row gutter={20}>
        <h2>Productions</h2>
        {fuelProduced.coal && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="COAL_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.oil && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="OIL_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.gas && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="GAS_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
      </Row>
      <Row gutter={20}>
        <h2>Reserves</h2>
        {fuelProduced.coal && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="COAL_RESERVES_GT"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.oil && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="OIL_RESERVES_BB"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.gas && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="GAS_RESERVES_BCM"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
      </Row>
    </div>
  );
}

ReservesAndPeaksTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
  fuelProduced: PropTypes.shape({
    coal: PropTypes.bool,
    oil: PropTypes.bool,
    gas: PropTypes.bool,
  }).isRequired,
};

export default ReservesAndPeaksTab;
