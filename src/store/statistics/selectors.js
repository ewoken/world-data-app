import { values, mapObjIndexed, mergeAll, groupBy, map, omit } from 'ramda';
import { countriesSelector } from '../countries';
import {
  parseMapOfStatistics,
  addPopCountryStatistics,
  memoize,
  maxAndIndex,
} from '../../utils';

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

export function countryStatisticsLoadedSelector(countryStatitics, state) {
  return countryStatitics.every(countryStatistic =>
    countryStatisticLoadedSelector(countryStatistic, state),
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
  if (value === null || (perCapita && !population)) {
    return null;
  }

  return perCapita ? (value * factor) / (populationFactor * population) : value;
}

function compiledCountryStatisticsSelectorFn(
  { mapOfCountryStatistics: baseMap, countryCode, perCapita },
  state,
) {
  const parsedMapOfCountryStatistics = parseMapOfStatistics(
    baseMap,
    countryCode,
  );
  const mapOfCountryStatistics = addPopCountryStatistics(
    parsedMapOfCountryStatistics,
    perCapita,
  );
  const mapOfStatistic = map(
    ({ statisticCode }) => statisticSelector(statisticCode, state),
    mapOfCountryStatistics,
  );
  const mapOfStatisticValues = map(
    countryStatistic => countryStatisticValuesSelector(countryStatistic, state),
    mapOfCountryStatistics,
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
    .map(year => Number(year))
    .filter(year => startingYear <= year && year <= endingYear)
    .sort()
    .map(year => mergeAll(allValuesByYear[year]))
    .map(compiledValue => ({
      ...compiledValue,
      ...mapObjIndexed((value, compileName) => {
        const popCompileName = `pop/${
          mapOfCountryStatistics[compileName].countryCode
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
      }, omit(['year'], compiledValue)),
    }));

  return compiledStatistics;
}
export const compiledCountryStatisticsSelector = memoize(
  compiledCountryStatisticsSelectorFn,
  args => JSON.stringify(args[0]),
);

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

export function statisticSourcesSelector(statisticCodes, state) {
  return statisticCodes.reduce((statisticSources, statisticCode) => {
    const statistic = statisticSelector(statisticCode, state);

    if (statistic.compute) {
      const sources = values(statistic.source).map(code =>
        statisticSelector(code, state),
      );
      return statisticSources.concat(sources);
    }

    return statisticSources.concat([statistic]);
  }, []);
}

const PEAK_THRESHOLD = 0.8;
const MAY_PEAK_THRESHOLD = 0.9;
const YEAR_AROUND_PEAK = 5;
export function statisticPeakYearSelector(countryStatistic, state) {
  const data = countryStatisticValuesSelector(countryStatistic, state);
  const dataLength = data.length;

  if (data.length < 1) {
    return null;
  }

  const { max, maxIndex } = maxAndIndex(data.map(v => v.value));
  const maxData = data[maxIndex];
  const lastValue = data[dataLength - 1].value;
  const firstValue = data[0].value;
  const mayPeakValue = MAY_PEAK_THRESHOLD * max;
  const hasPeakValue = PEAK_THRESHOLD * max;

  if (lastValue > mayPeakValue) {
    // no simple peak
    return null;
  }

  if (lastValue < hasPeakValue) {
    // has a peak
    if (maxIndex < 1) {
      // peak at first value
      return { ...maxData, sure: true, before: true };
    }
    if (firstValue > hasPeakValue) {
      // may have peaked before
      return { ...maxData, sure: false, before: true };
    }
    if (maxAndIndex < dataLength - YEAR_AROUND_PEAK) {
      return { ...maxData, sure: false, before: false }; // may be a brief decrease
    }
    return { ...maxData, sure: true, before: false };
  }

  if (firstValue < hasPeakValue) {
    return { ...maxData, sure: false, before: false };
  }

  return null;
}
