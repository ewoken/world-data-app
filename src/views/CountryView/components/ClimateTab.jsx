import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import BasicChartContainer from '../containers/BasicChartContainer';
import SettingsComponent from './SettingsComponent';

import { countriesAndAreasSelector } from '../../../store/otherSelectors';

const ConnectedSettingsComponent = connect(state => ({
  countries: countriesAndAreasSelector(state),
}))(SettingsComponent);

function ClimateTab(props) {
  const { countryCode, setReferenceCountry, referenceCountryCode } = props;
  return (
    <div className="ClimateTab">
      <Row>
        <Col md={24} sm={24}>
          <ConnectedSettingsComponent
            setReferenceCountry={setReferenceCountry}
            referenceCountryCode={referenceCountryCode}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="FOSSIL_CO2_EMISSIONS_MT"
            perCapita
            countryCode={countryCode}
            referenceCountryCode={referenceCountryCode}
            withReference
          />
        </Col>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="PRIMARY_ENERGY_CONSUMPTION_MTOE"
            perCapita
            countryCode={countryCode}
            referenceCountryCode={referenceCountryCode}
            withReference
          />
        </Col>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="CO2_INTENSITY_OF_ENERGY"
            countryCode={countryCode}
            referenceCountryCode={referenceCountryCode}
            withReference
          />
        </Col>
      </Row>
      <Row>
        <Col md={8} sm={24}>
          <BasicChartContainer
            statisticCode="LOW_CARBON_ENERGY_PRODUCTION_MTOE"
            countryCode={countryCode}
            referenceCountryCode={referenceCountryCode}
            perCapita
            withReference
          />
        </Col>
      </Row>
    </div>
  );
}

ClimateTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
  setReferenceCountry: PropTypes.func.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
};

export default ClimateTab;
