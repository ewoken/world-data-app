import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spin } from 'antd';

import ProdConsoChart from '../components/ProdConsoChart';

import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  statisticSelector,
  compiledCountryStatisticsSelector,
} from '../../../store/statistics';

const ConnectedProdConsoChart = connect((state, props) => ({
  prodStatistic: statisticSelector(props.prodStatisticCode, state),
  consoStatistic: statisticSelector(props.consoStatisticCode, state),
  data: compiledCountryStatisticsSelector(
    {
      mapOfStatisticCodes: {
        prod: props.prodStatisticCode,
        conso: props.consoStatisticCode,
      },
      countryCode: props.countryCode,
    },
    state,
  ),
}))(ProdConsoChart);

class ProdConsoChartContainer extends Component {
  componentDidMount() {
    const {
      consoStatisticCode,
      prodStatisticCode,
      countryCode,
      loadStatistics,
    } = this.props;
    const statisticCodes = [consoStatisticCode, prodStatisticCode];
    loadStatistics({ statisticCodes, countryCode });
  }

  componentDidUpdate(prevProps) {
    const {
      countryCode,
      loadStatistics,
      consoStatisticCode,
      prodStatisticCode,
    } = this.props;
    const statisticCodes = [consoStatisticCode, prodStatisticCode];
    if (countryCode !== prevProps.countryCode) {
      loadStatistics({ statisticCodes, countryCode });
    }
  }

  render() {
    const {
      isLoaded,
      fuel,
      consoStatisticCode,
      prodStatisticCode,
      countryCode,
    } = this.props;

    return (
      <Spin spinning={!isLoaded}>
        <ConnectedProdConsoChart
          fuel={fuel}
          consoStatisticCode={consoStatisticCode}
          prodStatisticCode={prodStatisticCode}
          countryCode={countryCode}
        />
      </Spin>
    );
  }
}

ProdConsoChartContainer.propTypes = {
  prodStatisticCode: PropTypes.string.isRequired,
  consoStatisticCode: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  fuel: PropTypes.string.isRequired,
  loadStatistics: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

export default connect(
  (state, props) => ({
    isLoaded: countryStatisticsLoadedSelector(
      {
        statisticCodes: [props.prodStatisticCode, props.consoStatisticCode],
        countryCode: props.countryCode,
      },
      state,
    ),
  }),
  { loadStatistics: loadCountryStatistics },
)(ProdConsoChartContainer);
