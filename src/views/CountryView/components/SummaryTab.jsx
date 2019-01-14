import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import EnergyMixChartContainer from '../containers/EnergyMixChartContainer';
import SettingsComponent from './SettingsComponent';
import { countriesAndAreasSelector } from '../../../store/otherSelectors';

const primaryMap = {
  coal: 'COAL_CONSUMPTION_MTOE',
  gas: 'GAS_CONSUMPTION_MTOE',
  oil: 'OIL_CONSUMPTION_MTOE',
  hydro: 'HYDRO_PRODUCTION_MTOE',
  nuclear: 'NUCLEAR_PRODUCTION_MTOE',
  biofuelsWaste: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
  solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
};
const primaryReference = 'PRIMARY_ENERGY_CONSUMPTION_MTOE';

const electrictyMap = {
  coal: 'COAL_ELECTRICITY_GENERATION_TWH',
  gas: 'GAS_ELECTRICITY_GENERATION_TWH',
  oil: 'OIL_ELECTRICITY_GENERATION_TWH',
  hydro: 'HYDRO_GENERATION_TWH',
  nuclear: 'NUCLEAR_GENERATION_TWH',
  biofuelsWaste: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
  solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH',
};
const electricityReference = 'ELECTRICITY_GENERATION_TWH';

const ConnectedSettingsComponent = connect(state => ({
  countries: countriesAndAreasSelector(state),
}))(SettingsComponent);

function SummaryTab(props) {
  const { countryCode, setReferenceCountry, referenceCountryCode } = props;
  return (
    <div className="SummaryTab">
      <Row>
        <Col md={24} sm={24}>
          <ConnectedSettingsComponent
            setReferenceCountry={setReferenceCountry}
            referenceCountryCode={referenceCountryCode}
          />
        </Col>
      </Row>
      <Row>
        <Col md={24} sm={24}>
          <EnergyMixChartContainer
            title="Primary energy consumption"
            description="PRIMARY_ENERGY_CONSUMPTION_MTOE"
            countryCode={countryCode}
            mapOfCountryStatistics={primaryMap}
            withReference={primaryReference}
            referenceCountryCode={referenceCountryCode}
            defaultPerCapita
            defaultStacked
          />
        </Col>
      </Row>
      <Row>
        <Col md={24} sm={24}>
          <EnergyMixChartContainer
            title="Electricity generation by fuels"
            description="ELECTRICITY_GENERATION_TWH"
            countryCode={countryCode}
            mapOfCountryStatistics={electrictyMap}
            withReference={electricityReference}
            referenceCountryCode={referenceCountryCode}
            defaultPerCapita
            defaultStacked
          />
        </Col>
      </Row>
    </div>
  );
}

SummaryTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
  setReferenceCountry: PropTypes.func.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
};

export default SummaryTab;
