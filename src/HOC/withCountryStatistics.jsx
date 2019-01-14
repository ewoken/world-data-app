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
import { countrySelector } from '../store/countries';

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
    statisticCode,
    mapOfCountryStatistics: mapOfCountryStatisticsInput,
    countryCode,
    withReference,
    referenceCountryCode = 'WORLD',
  } = props;
  const isIntensive =
    statisticCode && statisticSelector(statisticCode, state).isIntensive;
  const mapOfCountryStatistics =
    (perCapita || isIntensive) && withReference
      ? {
          ...mapOfCountryStatisticsInput,
          reference: {
            countryCode: referenceCountryCode,
            statisticCode:
              typeof withReference === 'boolean'
                ? statisticCode
                : withReference,
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
  const isLoaded = countryStatisticsLoadedSelector(
    countryStatisticsToLoad,
    state,
  );
  const data = isLoaded
    ? compiledCountryStatisticsSelector(
        {
          mapOfCountryStatistics,
          countryCode: props.countryCode,
          perCapita: props.perCapita,
        },
        state,
      )
    : [];

  return {
    data,
    statistics: map(
      ({ statisticCode: code }) => statisticSelector(code, state),
      parsedMapOfCountryStatistics,
    ),
    statisticSources: statisticSourcesSelector(statisticCodes, state),
    isLoaded,
    countryStatisticsToLoad,
    country: countrySelector(countryCode, state),
    referenceCountry: countrySelector(referenceCountryCode, state),
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
