import React from 'react';
import { connect } from 'react-redux';
import { map, values, pickBy } from 'ramda';

import { Spin } from 'antd';

import buildLoader from './buildLoader';
import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  statisticSelector,
  compiledCountryStatisticsSelector,
} from '../store/statistics';
import { parseMapOfStatistics } from '../utils';

const StatisticsLoader = buildLoader(({ countryStatistics }) =>
  loadCountryStatistics(countryStatistics),
);

function defaultSelector(state, props) {
  return {
    value: props.statisticCode,
  };
}

function computeMapOfCountryStatistics({
  baseMapOfCountryStatistics,
  countryCode,
  perCapita,
  worldReference,
}) {
  const mapOfCountryStatisticsWithReference =
    perCapita && worldReference
      ? {
          ...baseMapOfCountryStatistics,
          world: {
            countryCode: 'WORLD',
            statisticCode: worldReference,
          },
        }
      : baseMapOfCountryStatistics;

  return parseMapOfStatistics(
    mapOfCountryStatisticsWithReference,
    countryCode,
    perCapita,
  );
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
      const baseMapOfCountryStatistics =
        props.mapOfCountryStatistics ||
        mapOfCountryStatisticsSelector(state, props);
      const mapOfCountryStatistics = computeMapOfCountryStatistics({
        baseMapOfCountryStatistics,
        countryCode: props.countryCode,
        perCapita: props.perCapita,
        worldReference: props.worldReference,
      });
      const countryStatistics = values(mapOfCountryStatistics);

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
          // in order to remove pop statistics added for computation TODO
          pickBy((v, k) => !k.startsWith('pop/'), mapOfCountryStatistics),
        ),
        isLoaded: countryStatisticsLoadedSelector(countryStatistics, state),
        countryStatistics,
        perCapita: props.perCapita || false,
      };
    })(props => (
      <Spin spinning={!props.isLoaded}>
        <StatisticsLoader countryStatistics={props.countryStatistics} />
        <WrappedComponent {...props} />
      </Spin>
    ));
  };
}

export default withCountryStatistic;
