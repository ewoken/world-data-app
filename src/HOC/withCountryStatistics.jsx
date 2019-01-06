import React from 'react';
import { connect } from 'react-redux';
import { map, values, uniq } from 'ramda';

import { Spin } from 'antd';

import buildLoader from './buildLoader';
import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  statisticSelector,
  compiledCountryStatisticsSelector,
  statisticSourcesSelector,
} from '../store/statistics';
import { parseMapOfStatistics, addPopCountryStatistics } from '../utils';

const StatisticsLoader = buildLoader(({ countryStatistics }) =>
  loadCountryStatistics(countryStatistics),
);

function defaultSelector(state, props) {
  return {
    value: props.statisticCode,
  };
}

function mapStateToProps(state, props) {
  const {
    perCapita,
    worldReference,
    mapOfCountryStatistics: mapOfCountryStatisticsInput,
    countryCode,
  } = props;
  const mapOfCountryStatistics =
    perCapita && worldReference
      ? {
          ...mapOfCountryStatisticsInput,
          world: {
            countryCode: 'WORLD',
            statisticCode: worldReference,
          },
        }
      : mapOfCountryStatisticsInput;

  const parsedMapOfCountryStatistics = parseMapOfStatistics(
    mapOfCountryStatistics,
    countryCode,
  );
  const mapOfCountryStatisticsToLoad = addPopCountryStatistics(
    parsedMapOfCountryStatistics,
    perCapita,
  );
  const countryStatisticsToLoad = values(mapOfCountryStatisticsToLoad);
  const statisticCodes = uniq(
    countryStatisticsToLoad.map(c => c.statisticCode),
  );

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
      ({ statisticCode }) => statisticSelector(statisticCode, state),
      parsedMapOfCountryStatistics,
    ),
    statisticSources: statisticSourcesSelector(statisticCodes, state),
    isLoaded: countryStatisticsLoadedSelector(countryStatisticsToLoad, state),
    countryStatisticsToLoad,
    perCapita: props.perCapita || false,
  };
}

function withCountryStatistics(
  mapOfCountryStatisticsSelectorInput = defaultSelector,
) {
  const mapOfCountryStatisticsSelector =
    typeof mapOfCountryStatisticsSelectorInput === 'object'
      ? () => mapOfCountryStatisticsSelectorInput
      : mapOfCountryStatisticsSelectorInput;

  return function withCountryStatisticWrapper(WrappedComponent) {
    return connect((state, props) =>
      mapStateToProps(state, {
        mapOfCountryStatistics: mapOfCountryStatisticsSelector(state, props),
        ...props,
      }),
    )(props => (
      <Spin spinning={!props.isLoaded}>
        <StatisticsLoader countryStatistics={props.countryStatisticsToLoad} />
        <WrappedComponent {...props} />
      </Spin>
    ));
  };
}

export default withCountryStatistics;
