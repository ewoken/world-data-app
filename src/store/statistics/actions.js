import { values, indexBy, prop } from 'ramda';

import {
  getAllStatistics,
  getStatisticOfAllCountries,
  getStatisticOfCountry,
} from '../../api/statistics';
import { countriesSelector } from '../countries';

import { statisticSelector, countryStatisticLoadedSelector } from './selectors';

export const STATISTICS_LOAD_ACTION = 'STATISTICS_LOAD_ACTION';
export const STATISTICS_RECEIVE_ACTION = 'STATISTICS_RECEIVE_ACTION';
export const COUNTRY_STATISTIC_LOAD_ACTION = 'COUNTRY_STATISTIC_LOAD_ACTION';
export const COUNTRY_STATISTIC_RECEIVE_ACTION =
  'COUNTRY_STATISTIC_RECEIVE_ACTION';
export const STATISTIC_LOAD_ALL_COUNTRIES_ACTION =
  'STATISTIC_LOAD_ALL_COUNTRIES_ACTION';
export const STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION =
  'STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION';

function loadStatisticsAction() {
  return { type: STATISTICS_LOAD_ACTION };
}

function receiveStatisticsAction({ data, errors }) {
  return { type: STATISTICS_RECEIVE_ACTION, data, errors };
}

function loadCountryStatisticAction(statisticCode, countryCode) {
  return { type: COUNTRY_STATISTIC_LOAD_ACTION, statisticCode, countryCode };
}

function receiveCountryStatisticAction({
  countryCode,
  statisticCode,
  data,
  errors,
}) {
  return {
    type: COUNTRY_STATISTIC_RECEIVE_ACTION,
    countryCode,
    statisticCode,
    data,
    errors,
  };
}

function loadStatisticOfCountriesAction(statisticCode, countries) {
  return {
    type: STATISTIC_LOAD_ALL_COUNTRIES_ACTION,
    statisticCode,
    countries,
  };
}

function receiveStatisticOfCountriesAction({
  statisticCode,
  countries,
  data,
  errors,
}) {
  return {
    type: STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION,
    countries,
    statisticCode,
    data,
    errors,
  };
}

export function loadAllStatistics() {
  return function dispatchLoadStatistics(dispatch) {
    dispatch(loadStatisticsAction());

    return getAllStatistics()
      .then(data => {
        const statistics = data.map(statistic => ({
          ...statistic,
          values: {},
        }));
        dispatch(
          receiveStatisticsAction({
            data: indexBy(prop('code'), statistics),
          }),
        );
      })
      .catch(errors => dispatch(receiveStatisticsAction({ errors })));
  };
}

export function loadCountryStatistic({ statisticCode, countryCode }) {
  return function dispatchLoadCountryStatistic(dispatch, getState) {
    const state = getState();
    const statistic = statisticSelector(statisticCode, state);

    if (statistic.compute) {
      const sourceCodes = values(statistic.source);
      const countryStatistics = sourceCodes.map(sourceCode => ({
        statisticCode: sourceCode,
        countryCode,
      }));
      dispatch(
        // eslint-disable-next-line no-use-before-define
        loadCountryStatistics(countryStatistics),
      );
    }

    if (countryStatisticLoadedSelector({ statisticCode, countryCode }, state)) {
      return;
    }

    dispatch(loadCountryStatisticAction(statisticCode, countryCode));

    getStatisticOfCountry(statisticCode, countryCode)
      .then(res => {
        const data = res.map(statisticValue => ({
          year: statisticValue.year,
          value: statisticValue.value,
        }));

        dispatch(
          receiveCountryStatisticAction({ countryCode, statisticCode, data }),
        );
      })
      .catch(errors =>
        dispatch(
          receiveCountryStatisticAction({ statisticCode, countryCode, errors }),
        ),
      );
  };
}

// TODO
export function loadCountryStatistics(countryStatistics) {
  return function dispatchloadCountryStatistics(dispatch) {
    return Promise.all(
      countryStatistics.map(countryStatistic =>
        dispatch(loadCountryStatistic(countryStatistic)),
      ),
    );
  };
}

export function loadStatisticOfCountries(statisticCode) {
  return function dispatchLoadStatisticOfCountries(dispatch, getState) {
    const state = getState();
    const statistic = statisticSelector(statisticCode, state);

    if (statistic.compute) {
      values(statistic.source).forEach(sourceCode =>
        dispatch(loadStatisticOfCountries(sourceCode)),
      );
    }

    const countries = countriesSelector(state);
    const isLoaded = countries.every(country =>
      countryStatisticLoadedSelector(
        { statisticCode, countryCode: country.alpha2Code },
        state,
      ),
    );

    if (isLoaded) {
      return;
    }

    dispatch(loadStatisticOfCountriesAction(statisticCode, countries));
    getStatisticOfAllCountries(statisticCode)
      .then(data =>
        dispatch(
          receiveStatisticOfCountriesAction({
            statisticCode,
            countries,
            data,
          }),
        ),
      )
      .catch(errors =>
        dispatch(
          receiveStatisticOfCountriesAction({
            statisticCode,
            countries,
            errors,
          }),
        ),
      );
  };
}
