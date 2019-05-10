import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { values, map } from 'ramda';

import { withRouter } from 'react-router-dom';

import { Spin } from 'antd';
import HDIByEnergyChart from '../components/HDIByEnergyChart';

import { buildChartWrapper } from '../../../HOC/buildChart';
import { countriesSelector } from '../../../store/countries';
import {
  statisticSelector,
  compiledStatisticForCountriesAndYear,
  loadStatisticOfCountries,
  statisticOfAllCountriesLoadedSelector,
  statisticSourcesSelector,
} from '../../../store/statistics';

const STATISTICS_MAP = {
  hdi: 'HUMAN_DEVELOPMENT_INDEX',
  energy: 'FINAL_ENERGY_CONSUMPTION_MTOE',
};
const STATISTICS_CODES = values(STATISTICS_MAP).concat(['POPULATION']);

class HDIByEnergyChartLoader extends Component {
  componentDidMount() {
    const { loadStatistic } = this.props;
    STATISTICS_CODES.map(loadStatistic);
  }

  render() {
    const { isLoaded } = this.props;
    return (
      <Spin spinning={!isLoaded}>
        <HDIByEnergyChart {...this.props} />
      </Spin>
    );
  }
}

HDIByEnergyChartLoader.propTypes = {
  loadStatistic: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

const hocs = [
  withRouter,
  connect(
    state => ({
      countries: countriesSelector(state),
      statisticSources: statisticSourcesSelector(STATISTICS_CODES, state),
      isLoaded: STATISTICS_CODES.every(statisticCode =>
        statisticOfAllCountriesLoadedSelector(statisticCode, state),
      ),
      statistics: map(
        statisticCode => statisticSelector(statisticCode, state),
        STATISTICS_MAP,
      ),
      data: compiledStatisticForCountriesAndYear(
        {
          mapOfCountryStatistics: STATISTICS_MAP,
          year: 2016,
          perCapita: true,
          withWorld: false,
        },
        state,
      ),
    }),
    {
      loadStatistic: loadStatisticOfCountries,
    },
  ),
  buildChartWrapper,
];

const HDIByEnergyChartContainer = compose(...hocs)(HDIByEnergyChartLoader);

export default HDIByEnergyChartContainer;
