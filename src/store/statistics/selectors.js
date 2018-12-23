import {
  values,
  mapObjIndexed,
  mergeAll,
  groupBy,
  map,
  omit,
  uniq,
} from 'ramda';
import { countriesSelector } from '../countries';

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
  const statistic = statisticSelector(statisticCode, state);
  if (statistic.compute) {
    return values(statistic.source).every(sourceCode =>
      countryStatisticLoadedSelector(
        { statisticCode: sourceCode, countryCode },
        state,
      ),
    );
  }

  const countryStatistic = countryStatisticSelector(
    {
      statisticCode,
      countryCode,
    },
    state,
  );
  return countryStatistic ? countryStatistic.loaded : false;
}

function computeDerivedValueFromCompiled(statistic) {
  return function compute({ year, ...sources }) {
    const value = statistic.compute(sources);
    return Number.isNaN(value) || !Number.isFinite(value)
      ? { year, value: null }
      : { year, value };
  };
}

export function countryStatisticValuesSelector(
  { statisticCode, countryCode },
  state,
) {
  const statistic = statisticSelector(statisticCode, state);

  if (statistic.compute) {
    // eslint-disable-next-line no-use-before-define
    return compiledCountryStatisticsSelector(
      {
        mapOfCountryStatistics: statistic.source,
        countryCode,
      },
      state,
    ).map(computeDerivedValueFromCompiled(statistic));
  }

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
