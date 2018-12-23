import { omit } from 'ramda';
import {
  COUNTRY_STATISTIC_RECEIVE_ACTION,
  COUNTRY_STATISTIC_LOAD_ACTION,
  STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION,
  STATISTICS_LOAD_ACTION,
  STATISTICS_RECEIVE_ACTION,
  STATISTIC_LOAD_ALL_COUNTRIES_ACTION,
} from './actions';

const initialCountryStatistic = {
  loading: true,
  loaded: false,
  errors: null,
  values: [],
};
function countryStatisticReducer(
  countryStatistic = initialCountryStatistic,
  action,
  countryCode,
) {
  switch (action.type) {
    case COUNTRY_STATISTIC_RECEIVE_ACTION:
      return {
        loading: false,
        loaded: !action.errors,
        errors: action.errors || null,
        values: action.data || [],
      };
    case STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION:
      return {
        loading: false,
        loaded: !action.errors,
        errors: action.errors || null,
        values:
          (action.data &&
            action.data
              .filter(d => d.countryCode === countryCode)
              .map(omit(['countryCode']))) ||
          [],
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
    case STATISTIC_LOAD_ALL_COUNTRIES_ACTION: {
      const statistic = state.data[action.statisticCode];
      return {
        ...state,
        data: {
          ...state.data,
          [action.statisticCode]: {
            ...statistic,
            values: {
              ...statistic.values,
              ...action.countries.reduce(
                (acc, country) => ({
                  ...acc,
                  [country.alpha2Code]: countryStatisticReducer(
                    undefined,
                    action,
                    country.alpha2Code,
                  ),
                }),
                {},
              ),
            },
          },
        },
      };
    }
    case STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION: {
      const statistic = state.data[action.statisticCode];
      return {
        ...state,
        data: {
          ...state.data,
          [action.statisticCode]: {
            ...statistic,
            values: {
              ...statistic.values,
              ...action.countries.reduce(
                (acc, country) => ({
                  ...acc,
                  [country.alpha2Code]: countryStatisticReducer(
                    statistic.values[country.alpha2Code],
                    action,
                    country.alpha2Code,
                  ),
                }),
                {},
              ),
              WORLD: countryStatisticReducer(
                statistic.values.WORLD,
                action,
                'WORLD',
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

export default statisticsReducer;
