import { values, mapObjIndexed, mergeAll, groupBy, map, range } from 'ramda';
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
  return (
    statistic && statistic.values[statistic.isGlobal ? 'WORLD' : countryCode]
  );
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
  return function compute(dataItem, _, data) {
    const value = statistic.compute(dataItem, data);
    return Number.isNaN(value) || !Number.isFinite(value)
      ? { year: dataItem.year, value: null }
      : { year: dataItem.year, value };
  };
}

export function countryStatisticValuesSelector(
  { statisticCode, countryCode, yearInterval },
  state,
) {
  const statistic = statisticSelector(statisticCode, state);

  if (statistic.compute) {
    // eslint-disable-next-line no-use-before-define
    return compiledCountryStatisticsSelector(
      {
        mapOfCountryStatistics: statistic.source,
        countryCode,
        yearInterval: statistic.isCompilation ? undefined : yearInterval,
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
  const interval = yearInterval || [
    statistic.startingYear,
    statistic.endingYear,
  ];
  return countryStatistic
    ? countryStatistic.values.filter(
        d => interval[0] <= d.year && d.year <= interval[1],
      )
    : [];
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

function computeYearInterval(mapOfStatistic, yearInterval = [0, 3000]) {
  const statistics = values(mapOfStatistic);
  const startingYears = statistics.map(statistic => statistic.startingYear);
  const endingYears = statistics.map(statistic => statistic.endingYear);
  const startingYear = Math.max(...startingYears, yearInterval[0]);
  const endingYear = Math.min(...endingYears, yearInterval[1]);
  return [startingYear, endingYear];
}

function computeValue(value, population, perCapita, factor, populationFactor) {
  if (value === null || (perCapita && !population)) {
    return null;
  }

  return perCapita ? (value * factor) / (populationFactor * population) : value;
}

function compiledCountryStatisticsSelectorFn(
  {
    mapOfCountryStatistics: baseMap,
    countryCode,
    perCapita,
    yearInterval: inputYearInterval,
  },
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
  const nullValues = map(() => null, mapOfStatistic);
  const yearInterval = computeYearInterval(mapOfStatistic, inputYearInterval);
  const mapOfStatisticValues = map(
    countryStatistic =>
      countryStatisticValuesSelector(
        { ...countryStatistic, yearInterval },
        state,
      ),
    mapOfCountryStatistics,
  );

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

  const compiledStatistics = range(yearInterval[0], yearInterval[1] + 1)
    .sort()
    .map(year => ({
      year,
      ...nullValues,
      ...mergeAll(allValuesByYear[year]),
    }))
    .map(compiledValue => ({
      ...compiledValue,
      ...mapObjIndexed(({ countryCode: cc }, compileName) => {
        const value = compiledValue[compileName];
        const popCompileName = `pop/${cc}`;
        return computeValue(
          value,
          compiledValue[popCompileName],
          perCapita && !mapOfStatistic[compileName].isIntensive,
          mapOfStatistic[compileName].unit.factor,
          mapOfStatistic[popCompileName]
            ? mapOfStatistic[popCompileName].unit.factor
            : null,
        );
      }, parsedMapOfCountryStatistics),
    }));

  return compiledStatistics;
}
export const compiledCountryStatisticsSelector = memoize(
  compiledCountryStatisticsSelectorFn,
  args => JSON.stringify(args[0]),
);

export function compiledStatisticForCountriesAndYear(
  {
    mapOfCountryStatistics: input,
    statisticCode,
    year,
    perCapita = false,
    withWorld = true,
  },
  state,
) {
  const countryCodes = countriesSelector(state).map(c => c.alpha2Code);
  const mapOfCountryStatistics = input || {
    value: statisticCode,
  };
  const yearInterval = [year, year];

  if (withWorld) {
    countryCodes.push('WORLD');
  }

  const countryValues = countryCodes.map(countryCode => {
    const countryStatisticValues = compiledCountryStatisticsSelector(
      {
        mapOfCountryStatistics,
        countryCode,
        perCapita,
        yearInterval,
      },
      state,
    );
    const yearValue = countryStatisticValues[0];

    return {
      countryCode,
      ...yearValue,
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
