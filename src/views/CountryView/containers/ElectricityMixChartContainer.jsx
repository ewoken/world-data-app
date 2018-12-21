import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { values } from 'ramda';

import { Spin } from 'antd';

import ElectricityMixChart from '../components/ElectricityMixChart';

import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  compiledCountryStatisticsSelector,
  energySourceCountryConsumedSelector,
} from '../../../store/statistics';

const WORLD = 'WORLD';

const mapOfStatistics = {
  coal: 'COAL_ELECTRICITY_GENERATION_TWH',
  gas: 'GAS_ELECTRICITY_GENERATION_TWH',
  oil: 'OIL_ELECTRICITY_GENERATION_TWH',
  hydro: 'HYDRO_PRODUCTION_MTOE',
  nuclear: 'NUCLEAR_PRODUCTION_MTOE',
  biofuelsWaste: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
  solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
  gen: 'ELECTRICITY_GENERATION_TWH',
};
const statisticCodes = values(mapOfStatistics).concat(['POPULATION']);
const worldReferences = ['POPULATION', 'ELECTRICITY_GENERATION_TWH'];

const ConnectedElectricityMixChart = connect(
  (state, { countryCode, perCapita }) => ({
    data: compiledCountryStatisticsSelector(
      {
        mapOfCountryStatistics: {
          ...mapOfStatistics,
          world: {
            statisticCode: 'ELECTRICITY_GENERATION_TWH',
            countryCode: WORLD,
          },
        },
        countryCode,
        perCapita,
      },
      state,
    ),
    sourceConsumed: energySourceCountryConsumedSelector(countryCode, state),
  }),
)(ElectricityMixChart);

class PrimaryEnergyChartContainer extends Component {
  constructor() {
    super();

    this.state = {
      stacked: true,
      perCapita: false,
    };
  }

  componentDidMount() {
    const { countryCode, loadStatistics } = this.props;

    loadStatistics({ statisticCodes, countryCode });
    loadStatistics({
      statisticCodes: worldReferences,
      countryCode: WORLD,
    });
  }

  componentDidUpdate(prevProps) {
    const { countryCode, loadStatistics } = this.props;
    if (countryCode !== prevProps.countryCode) {
      loadStatistics({ statisticCodes, countryCode });
    }
  }

  setStacked(stacked) {
    this.setState({ stacked });
  }

  setPerCapita(perCapita) {
    this.setState({ perCapita });
  }

  render() {
    const { isLoaded, countryCode } = this.props;
    const { stacked, perCapita } = this.state;

    return (
      <Spin spinning={!isLoaded}>
        <ConnectedElectricityMixChart
          countryCode={countryCode}
          setStacked={value => this.setStacked(value)}
          setPerCapita={value => this.setPerCapita(value)}
          stacked={stacked}
          perCapita={perCapita}
        />
      </Spin>
    );
  }
}

PrimaryEnergyChartContainer.propTypes = {
  countryCode: PropTypes.string.isRequired,
  loadStatistics: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

export default connect(
  (state, props) => ({
    isLoaded:
      countryStatisticsLoadedSelector(
        {
          statisticCodes,
          countryCode: props.countryCode,
        },
        state,
      ) &&
      countryStatisticsLoadedSelector(
        {
          statisticCodes: worldReferences,
          countryCode: WORLD,
        },
        state,
      ),
  }),
  { loadStatistics: loadCountryStatistics },
)(PrimaryEnergyChartContainer);
