import { connect } from 'react-redux';

import buildChart from '../../../HOC/buildChart';
import EnergyMixChart from '../components/EnergyMixChart';

import { fuelConsumedCountrySelector } from '../../../store/countries';

const EnergyMixChartBuilded = buildChart({
  perCapitaSwitch: true,
  stackedSwitch: true,
})(EnergyMixChart);

const EnergyMixChartContainer = connect((state, { countryCode }) => ({
  fuelConsumed: fuelConsumedCountrySelector(countryCode, state),
}))(EnergyMixChartBuilded);

export default EnergyMixChartContainer;
