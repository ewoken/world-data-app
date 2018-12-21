import {
  values,
  indexBy,
  prop,
  mapObjIndexed,
  mergeAll,
  groupBy,
  map,
  omit,
  uniq,
} from 'ramda';

import {
  getAllStatistics,
  getStatisticOfCountry,
  getStatisticOfAllCountries,
} from '../api/statistics';
import { countriesSelector } from './countries';

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
  return statistic && statistic.values[countryCode];
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

export function statisticOfAllCountriesLoadedSelector(statisticCode, state) {
  const countryCodes = countriesSelector(state).map(
    country => country.alpha2Code,
  );
  return countryCodes.every(countryCode =>
    countryStatisticLoadedSelector({ statisticCode, countryCode }, state),
  );
}

function computeYearInterval(mapOfStatisticValues) {
  const arrayOfStatisticValues = values(mapOfStatisticValues);
  const startingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.min(...statisticValues.map(v => v.year)),
  );
  const endingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.max(...statisticValues.map(v => v.year)),
  );
  const startingYear = Math.max(...startingYears);
  const endingYear = Math.min(...endingYears);
  return [startingYear, endingYear];
}

function computeValue(value, population, perCapita, factor, populationFactor) {
  if (value === null || (!population && perCapita)) {
    return null;
  }

  return perCapita ? (value * factor) / (populationFactor * population) : value;
}

function parseMapOfStatistics(
  mapOfCountryStatistics,
  defaultCountry,
  perCapita,
) {
  const parsed = map(
    statistics =>
      typeof statistics === 'string'
        ? { statisticCode: statistics, countryCode: defaultCountry }
        : statistics,
    mapOfCountryStatistics,
  );
  const countryCodes = uniq(values(parsed).map(d => d.countryCode));
  const populations = mergeAll(
    countryCodes.map(countryCode => ({
      [`pop/${countryCode}`]: { statisticCode: 'POPULATION', countryCode },
    })),
  );
  return {
    ...(perCapita ? populations : {}),
    ...parsed,
  };
}

export function compiledCountryStatisticsSelector(
  { mapOfCountryStatistics, countryCode, perCapita },
  state,
) {
  const parsedMapOfCountryStatistics = parseMapOfStatistics(
    mapOfCountryStatistics,
    countryCode,
    perCapita,
  );
  const mapOfStatistic = map(
    ({ statisticCode }) => statisticSelector(statisticCode, state),
    parsedMapOfCountryStatistics,
  );
  const mapOfStatisticValues = map(
    countryStatistic => countryStatisticValuesSelector(countryStatistic, state),
    parsedMapOfCountryStatistics,
  );
  const [startingYear, endingYear] = computeYearInterval(mapOfStatisticValues);

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
    .map(year => mergeAll(allValuesByYear[year]))
    .filter(value => startingYear <= value.year && value.year <= endingYear)
    .map(compiledValue => ({
      ...compiledValue,
      ...mapObjIndexed((value, compileName) => {
        const popCompileName = `pop/${
          parsedMapOfCountryStatistics[compileName].countryCode
        }`;
        return computeValue(
          value,
          compiledValue[popCompileName],
          perCapita,
          mapOfStatistic[compileName].unit.factor,
          mapOfStatistic[popCompileName]
            ? mapOfStatistic[popCompileName].unit.factor
            : null,
        );
      }, omit(['year', 'pop'], compiledValue)),
    }));

  return compiledStatistics;
}

export function energySourceCountryConsumedSelector(countryCode, state) {
  const check = d => d.value > 0.01;
  const statisticCodeMap = {
    coal: 'COAL_CONSUMPTION_MTOE',
    gas: 'GAS_CONSUMPTION_MTOE',
    oil: 'OIL_CONSUMPTION_MTOE',
    hydro: 'HYDRO_PRODUCTION_MTOE',
    nuclear: 'NUCLEAR_PRODUCTION_MTOE',
    biofuelsWaste: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
    solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
  };
  return map(
    statisticCode =>
      countryStatisticValuesSelector(
        { statisticCode, countryCode },
        state,
      ).some(check),
    statisticCodeMap,
  );
}

export function compiledStatisticForCountriesAndYear(
  { statisticCode, year, perCapita },
  state,
) {
  const countryCodes = countriesSelector(state).map(c => c.alpha2Code);
  const mapOfCountryStatistics = {
    value: statisticCode,
  };
  countryCodes.push('WORLD');

  const countryValues = countryCodes.map(countryCode => {
    const countryStatisticValues = compiledCountryStatisticsSelector(
      { mapOfCountryStatistics, countryCode, perCapita },
      state,
    );
    const yearValue = countryStatisticValues.find(v => v.year === year);

    return {
      countryCode,
      value: yearValue ? yearValue.value : null,
    };
  });
  return countryValues;
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

export function loadStatisticOfCountries(statisticCode) {
  return function dispatchLoadStatisticOfCountries(dispatch, getState) {
    const countries = countriesSelector(getState());
    const isLoaded = countries.every(country =>
      countryStatisticLoadedSelector(
        { statisticCode, countryCode: country.alpha2Code },
        getState(),
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

export default statisticsReducer;
