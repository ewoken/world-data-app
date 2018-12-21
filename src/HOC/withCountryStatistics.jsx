import React from 'react';
import { connect } from 'react-redux';
import { map, values } from 'ramda';

import { Spin } from 'antd';

import buildLoader from './buildLoader';
import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  statisticSelector,
  compiledCountryStatisticsSelector,
} from '../store/statistics';

const StatisticsLoader = buildLoader(loadCountryStatistics);

function defaultSelector(state, props) {
  return {
    value: props.statisticCode,
  };
}

function withCountryStatistic(
  mapOfCountryStatisticsSelectorInput = defaultSelector,
) {
  const mapOfCountryStatisticsSelector =
    typeof mapOfCountryStatisticsSelectorInput === 'object'
      ? () => mapOfCountryStatisticsSelectorInput
      : mapOfCountryStatisticsSelectorInput;

  return function withCountryStatisticWrapper(WrappedComponent) {
    return connect((state, props) => {
      const mapOfCountryStatistics = mapOfCountryStatisticsSelector(
        state,
        props,
      );
      const statisticCodes = values(mapOfCountryStatistics);
      return {
        data: compiledCountryStatisticsSelector(
          {
            mapOfCountryStatistics,
            countryCode: props.countryCode,
            perCapita: props.perCapita,
          },
          state,
        ),
        statistics: map(
          statisticCode => statisticSelector(statisticCode, state),
          mapOfCountryStatistics,
        ),
        isLoaded: countryStatisticsLoadedSelector(
          {
            statisticCodes,
            countryCode: props.countryCode,
          },
          state,
        ),
        statisticCodes,
        perCapita: props.perCapita || false,
      };
    })(props => (
      <Spin spinning={!props.isLoaded}>
        <StatisticsLoader
          statisticCodes={props.statisticCodes}
          countryCode={props.countryCode}
        />
        <WrappedComponent {...props} />
      </Spin>
    ));
  };
}

export default withCountryStatistic;
