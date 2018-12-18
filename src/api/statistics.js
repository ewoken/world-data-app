import { values, groupBy, mergeAll } from 'ramda';
import { fetchJSON } from './helpers';

const PERCENTAGE_UNIT = {
  main: '%',
  base: '%',
  factor: 1,
};

const derivedStatistics = [
  {
    code: 'ENERGY_SELF_SUFFICIENCY',
    name: 'Energy Self-sufficiency',
    description: '',
    unit: PERCENTAGE_UNIT,
    source: {
      consumption: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
      production: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    isIntensive: true,
    compute({ consumption, production }) {
      return Math.floor((production / consumption) * 100);
    },
  },
];
const derivedCodes = derivedStatistics.map(d => d.code);

function computeDerivedValueFromCompiled(statistic) {
  return function compute({ year, countryCode, ...sources }) {
    const value = statistic.compute(sources);
    return Number.isNaN(value)
      ? { year, countryCode, value: null }
      : { year, countryCode, value };
  };
}

export function getAllStatistics() {
  return fetchJSON('/data/statistics.json').then(statistics =>
    statistics.concat(derivedStatistics),
  );
}

async function getDerivedStatisticOfCountry(statisticCode, countryCode) {
  const statistic = derivedStatistics.find(stat => stat.code === statisticCode);
  const sourceNames = Object.keys(statistic.source);

  const statisticValues = await Promise.all(
    sourceNames.map(sourceName =>
      // eslint-disable-next-line no-use-before-define
      getStatisticOfCountry(statistic.source[sourceName], countryCode),
    ),
  );

  const mapOfNamedStatisticValues = sourceNames.map((sourceName, index) =>
    statisticValues[index].map(({ year, value }) => ({
      year,
      [sourceName]: value,
    })),
  );
  const allValues = [].concat(...values(mapOfNamedStatisticValues));
  const allValuesByYear = groupBy(value => value.year, allValues);
  const derivedStatisticValues = Object.keys(allValuesByYear)
    .sort()
    .map(year => mergeAll(allValuesByYear[year]))
    .map(computeDerivedValueFromCompiled(statistic));

  return derivedStatisticValues;
}

export function getStatisticOfCountry(statisticCode, countryCode) {
  if (derivedCodes.includes(statisticCode)) {
    return getDerivedStatisticOfCountry(statisticCode, countryCode);
  }

  return fetchJSON(`/data/${statisticCode}/${countryCode}.json`);
}

async function getDerivedStatisticOfAllCountries(statisticCode) {
  const statistic = derivedStatistics.find(stat => stat.code === statisticCode);
  const sourceNames = Object.keys(statistic.source);

  const statisticValues = await Promise.all(
    sourceNames.map(sourceName =>
      // eslint-disable-next-line no-use-before-define
      getStatisticOfAllCountries(statistic.source[sourceName]),
    ),
  );

  const mapOfNamedStatisticValues = sourceNames.map((sourceName, index) =>
    statisticValues[index].map(({ year, value, countryCode }) => ({
      year,
      countryCode,
      [sourceName]: value,
    })),
  );
  const allValues = [].concat(...values(mapOfNamedStatisticValues));
  const allValuesByYearAndCountry = groupBy(
    value => `${value.countryCode}${value.year}`,
    allValues,
  );

  const derivedStatisticValues = values(allValuesByYearAndCountry)
    .map(countryYearValues => mergeAll(countryYearValues))
    .map(computeDerivedValueFromCompiled(statistic));

  return derivedStatisticValues;
}

export function getStatisticOfAllCountries(statisticCode) {
  if (derivedCodes.includes(statisticCode)) {
    return getDerivedStatisticOfAllCountries(statisticCode);
  }

  return fetchJSON(`/data/${statisticCode}/all.json`);
}
