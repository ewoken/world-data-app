import { connect } from 'react-redux';

import buildChart from '../../../HOC/buildChart';
import EnergyMixChart from '../components/EnergyMixChart';

import { energySourceCountryConsumedSelector } from '../../../store/statistics';

const EnergyMixChartBuilded = buildChart({
  perCapitaSwitch: true,
  stackedSwitch: true,
})(EnergyMixChart);

const EnergyMixChartContainer = connect((state, { countryCode }) => ({
  sourceConsumed: energySourceCountryConsumedSelector(countryCode, state),
}))(EnergyMixChartBuilded);

export default EnergyMixChartContainer;
