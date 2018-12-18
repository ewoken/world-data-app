import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spin } from 'antd';

import SelfSufficiencyChart from '../components/SelfSufficiencyChart';

import {
  loadCountryStatistic,
  countryStatisticLoadedSelector,
  countryStatisticValuesSelector,
} from '../../../store/statistics';

const ENERGY_SELF_SUFFICIENCY = 'ENERGY_SELF_SUFFICIENCY';

const ConnectedSelfSufficiencyChart = connect((state, { countryCode }) => ({
  data: countryStatisticValuesSelector(
    {
      statisticCode: ENERGY_SELF_SUFFICIENCY,
      countryCode,
    },
    state,
  ),
}))(SelfSufficiencyChart);

class PrimaryEnergyChartContainer extends Component {
  componentDidMount() {
    const { countryCode, loadStatistic } = this.props;

    loadStatistic({ statisticCode: ENERGY_SELF_SUFFICIENCY, countryCode });
  }

  componentDidUpdate(prevProps) {
    const { countryCode, loadStatistic } = this.props;
    if (countryCode !== prevProps.countryCode) {
      loadStatistic({ statisticCode: ENERGY_SELF_SUFFICIENCY, countryCode });
    }
  }

  render() {
    const { isLoaded, countryCode } = this.props;

    return (
      <Spin spinning={!isLoaded}>
        <ConnectedSelfSufficiencyChart countryCode={countryCode} />
      </Spin>
    );
  }
}

PrimaryEnergyChartContainer.propTypes = {
  countryCode: PropTypes.string.isRequired,
  loadStatistic: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

export default connect(
  (state, props) => ({
    isLoaded: countryStatisticLoadedSelector(
      {
        statisticCode: ENERGY_SELF_SUFFICIENCY,
        countryCode: props.countryCode,
      },
      state,
    ),
  }),
  { loadStatistic: loadCountryStatistic },
)(PrimaryEnergyChartContainer);
