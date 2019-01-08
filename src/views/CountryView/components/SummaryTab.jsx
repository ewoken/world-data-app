import React from 'react';
import PropTypes from 'prop-types';

import EnergyMixChartContainer from '../containers/EnergyMixChartContainer';

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

function SummaryTab(props) {
  const { countryCode } = props;
  return (
    <div className="SummaryTab">
      <div>
        <EnergyMixChartContainer
          title="Primary energy consumption"
          description="PRIMARY_ENERGY_CONSUMPTION_MTOE"
          countryCode={countryCode}
          mapOfCountryStatistics={primaryMap}
          worldReference={primaryReference}
          defaultPerCapita
          defaultStacked
        />
      </div>
      <div id="test" style={{ marginTop: '20px' }}>
        <EnergyMixChartContainer
          title="Electricity generation by fuels"
          description="ELECTRICITY_GENERATION_TWH"
          countryCode={countryCode}
          mapOfCountryStatistics={electrictyMap}
          worldReference={electricityReference}
          defaultPerCapita
          defaultStacked
        />
      </div>
    </div>
  );
}

SummaryTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default SummaryTab;
