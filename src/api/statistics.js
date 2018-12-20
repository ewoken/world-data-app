import { values, groupBy, mergeAll } from 'ramda';
import { fetchJSON } from './helpers';

const PERCENTAGE_UNIT = {
  main: '%',
  base: '%',
  factor: 1,
};

// const MTOE_UNIT = {
//   main: 'Mtoe',
//   base: 'toe',
//   factor: 10 ** 6,
// };

const ENERGY_INTENSITY_UNIT = {
  main: 'toe/million 2010 $',
  base: 'toe/million 2010 $',
  factor: 1,
};

const CO2_INTENSITY_OF_ENERGY_UNIT = {
  main: 'tCO2/toe',
  base: 'tCO2/toe',
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
  {
    code: 'ENERGY_INTENSITY',
    name: 'Energy Intensity',
    description: '',
    unit: ENERGY_INTENSITY_UNIT,
    source: {
      energy: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
      gdp: 'GDP_2010_USD',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA, World Bank',
    isIntensive: true,
    compute({ energy, gdp }) {
      return Math.floor((energy * 10 ** 8) / gdp) * 10;
    },
  },
  {
    code: 'CO2_INTENSITY_OF_ENERGY',
    name: 'CO2 Intensity of energy',
    description: '',
    unit: CO2_INTENSITY_OF_ENERGY_UNIT,
    source: {
      co2: 'CO2_EMISSIONS_MT',
      energy: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA, World Bank',
    isIntensive: true,
    compute({ energy, co2 }) {
      return Number((co2 / energy).toFixed(2));
    },
  },
  // ...['COAL', 'OIL', 'GAS'].map(fuel => ({ TODO bicolors
  //   code: `${fuel}_TRADE`,
  //   name: `Trade of ${fuel.toLowerCase()}`,
  //   description: '',
  //   unit: MTOE_UNIT,
  //   source: {
  //     prod: `${fuel}_PRODUCTION_MTOE`,
  //     conso: `${fuel}_CONSUMPTION_MTOE`,
  //   },
  //   startingYear: 1973,
  //   endingYear: 2016,
  //   sourceAttribution: 'IEA, World Bank',
  //   isIntensive: true,
  //   compute({ prod, conso }) {
  //     return conso - prod;
  //   },
  // })),
];
const derivedCodes = derivedStatistics.map(d => d.code);

function computeDerivedValueFromCompiled(statistic) {
  return function compute({ year, countryCode, ...sources }) {
    const value = statistic.compute(sources);
    return Number.isNaN(value) || !Number.isFinite(value)
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
