import {
  values,
  indexBy,
  prop,
  mapObjIndexed,
  mergeAll,
  groupBy,
  map,
} from 'ramda';

import { getAllStatistics, getStatisticOfCountry } from '../api/statistics';
import { countrySelector } from './countries';

export const STATISTICS_LOAD_ACTION = 'STATISTICS_LOAD_ACTION';
export const STATISTICS_RECEIVE_ACTION = 'STATISTICS_RECEIVE_ACTION';
export const COUNTRY_STATISTIC_LOAD_ACTION = 'COUNTRY_STATISTIC_LOAD_ACTION';
export const COUNTRY_STATISTIC_RECEIVE_ACTION =
  'COUNTRY_STATISTIC_RECEIVE_ACTION';

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

const initialCountryStatistic = {
  loading: true,
  loaded: false,
  errors: null,
  values: [],
};
function countryStatisticReducer(countryStatistic, action) {
  switch (action.type) {
    case COUNTRY_STATISTIC_LOAD_ACTION:
      return initialCountryStatistic;
    case COUNTRY_STATISTIC_RECEIVE_ACTION:
      return {
        loading: false,
        loaded: !action.errors,
        errors: action.errors || null,
        values: action.data || {},
      };
    default:
      return countryStatistic;
  }
}

const initialState = {
  loading: false,
  loaded: false,
  errors: null,
  data: {},
};
function statisticsReducer(state = initialState, action) {
  switch (action.type) {
    case STATISTICS_LOAD_ACTION:
      return { ...state, loading: true };
    case STATISTICS_RECEIVE_ACTION:
      return {
        ...state,
        loading: false,
        loaded: !action.errors,
        errors: action.errors || null,
        data: action.data || {},
      };
    case COUNTRY_STATISTIC_LOAD_ACTION:
    case COUNTRY_STATISTIC_RECEIVE_ACTION: {
      const statistic = state.data[action.statisticCode];
      const countryStatistic = statistic.values[action.countryCode];
      return {
        ...state,
        data: {
          ...state.data,
          [action.statisticCode]: {
            ...statistic,
            values: {
              ...statistic.values,
              [action.countryCode]: countryStatisticReducer(
                countryStatistic,
                action,
              ),
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

export function statisticsLoadedSelector(state) {
  return state.statistics.loaded;
}

export function allStatisticsSelector(state) {
  return values(state.statistics.data);
}

export function statisticSelector(statisticCode, state) {
  return state.statistics.data[statisticCode];
}

export function countryStatisticSelector(
  { statisticCode, countryCode },
  state,
) {
  const statistic = statisticSelector(statisticCode, state);
  return statistic.values[countryCode];
}

export function countryStatisticLoadedSelector(
  { statisticCode, countryCode },
  state,
) {
  const countryStatistic = countryStatisticSelector(
    {
      statisticCode,
      countryCode,
    },
    state,
  );
  return countryStatistic ? countryStatistic.loaded : false;
}

export function countryStatisticValuesSelector(
  { statisticCode, countryCode },
  state,
) {
  const countryStatistic = countryStatisticSelector(
    {
      statisticCode,
      countryCode,
    },
    state,
  );
  return countryStatistic ? countryStatistic.values : [];
}

export function countryStatisticsLoadedSelector(
  { statisticCodes, countryCode },
  state,
) {
  return statisticCodes.every(statisticCode =>
    countryStatisticLoadedSelector({ statisticCode, countryCode }, state),
  );
}

export function compiledCountryStatisticsSelector(
  { mapOfStatisticCodes, countryCode },
  state,
) {
  const mapOfStatisticValues = map(
    statisticCode =>
      countryStatisticValuesSelector({ statisticCode, countryCode }, state),
    mapOfStatisticCodes,
  );
  const arrayOfStatisticValues = values(mapOfStatisticValues);

  const startingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.min(...statisticValues.map(v => v.year)),
  );
  const endingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.max(...statisticValues.map(v => v.year)),
  );

  const startingYear = Math.max(...startingYears);
  const endingYear = Math.min(...endingYears);

  const mapOfNamedStatisticValues = mapObjIndexed(
    (statisticValues, compileName) =>
      statisticValues.map(({ year, value }) => ({
        year,
        [compileName]: value,
      })),
    mapOfStatisticValues,
  );
  const allValues = [].concat(...values(mapOfNamedStatisticValues));
  const allValuesByYear = groupBy(value => value.year, allValues);
  const compiledStatistics = Object.keys(allValuesByYear)
    .sort()
    .map(year => {
      const valuesOfYear = allValuesByYear[year];

      return mergeAll(valuesOfYear);
    })
    .filter(value => startingYear <= value.year && value.year <= endingYear);

  return compiledStatistics;
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
    const country = countrySelector(countryCode, state);

    // TODO
    if (statistic.values[countryCode] && statistic.values[countryCode].loaded) {
      return;
    }

    dispatch(loadCountryStatisticAction(statisticCode, countryCode));

    getStatisticOfCountry(statistic, country)
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
export function loadCountryStatistics({ statisticCodes, countryCode }) {
  return function dispatchloadCountryStatistics(dispatch, getState) {
    return Promise.all(
      statisticCodes.map(statisticCode =>
        loadCountryStatistic({ statisticCode, countryCode })(
          dispatch,
          getState,
        ),
      ),
    );
  };
}

export default statisticsReducer;
