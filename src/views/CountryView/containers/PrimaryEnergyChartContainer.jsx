import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { values } from 'ramda';

import { Spin } from 'antd';

import PrimaryEnergyChart from '../components/PrimaryEnergyChart';

import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  compiledCountryStatisticsSelector,
} from '../../../store/statistics';

const mapOfStatisticCodes = {
  coal: 'COAL_CONSUMPTION_MTOE',
  gas: 'GAS_CONSUMPTION_MTOE',
  oil: 'OIL_CONSUMPTION_MTOE',
  hydro: 'HYDRO_CONSUMPTION_MTOE',
  nuclear: 'NUCLEAR_CONSUMPTION_MTOE',
  renewables: 'NON_HYDRO_RENEWABLES_CONSUMPTION_MTOE',
  population: 'POPULATION',
};
const statisticCodes = values(mapOfStatisticCodes);

const ConnectedPrimaryEnergyChart = connect((state, { countryCode }) => ({
  data: compiledCountryStatisticsSelector(
    {
      mapOfStatisticCodes,
      countryCode,
    },
    state,
  ),
}))(PrimaryEnergyChart);

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

    return isLoaded ? (
      <ConnectedPrimaryEnergyChart
        countryCode={countryCode}
        setStacked={value => this.setStacked(value)}
        setPerCapita={value => this.setPerCapita(value)}
        stacked={stacked}
        perCapita={perCapita}
      />
    ) : (
      <Spin>
        <ConnectedPrimaryEnergyChart
          countryCode={countryCode}
          stacked={stacked}
          perCapita={perCapita}
          setStacked={() => {}}
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
    isLoaded: countryStatisticsLoadedSelector(
      {
        statisticCodes,
        countryCode: props.countryCode,
      },
      state,
    ),
  }),
  { loadStatistics: loadCountryStatistics },
)(PrimaryEnergyChartContainer);
