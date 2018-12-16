const { mergeAll, map } = require('ramda');
const { retryFetch } = require('./helpers');
const { independentCountries } = require('../countries');

const WORLD_BANK_API = 'WORLD_BANK_API';

const config = {
  POPULATION: {
    worldBankCode: 'SP.POP.TOTL',
  },
  GDP_2010_USD: {
    worldBankCode: 'NY.GDP.MKTP.KD',
    unitConverter: value => Number((value / 10 ** 6).toFixed(2)),
  },
  CO2_EMISSIONS_GT: {
    worldBankCode: 'EN.ATM.CO2E.KT',
    unitConverter: value => Number((value / 10 ** 3).toFixed(2)),
  },
};

async function fetchCountryStatisticFromWorldBank(statisticCode, country) {
  const { worldBankCode, unitConverter = i => i } = config[statisticCode];
  const { alpha2Code } = country;

  const data = await retryFetch(
    `http://api.worldbank.org/v2/countries/${alpha2Code}/indicators/${worldBankCode}?format=json&per_page=100`,
  );

  if (!data[1]) {
    return [];
  }

  return data[1].map(object => ({
    year: Number(object.date),
    value: unitConverter(object.value),
  }));
}

async function fetchStatisticFromWorldBank(statistic) {
  const statisticCode = statistic.code;
  const dataByCountry = await Promise.all(
    independentCountries.map(country =>
      fetchCountryStatisticFromWorldBank(statisticCode, country).then(data => ({
        [country.alpha2Code]: data,
      })),
    ),
  );

  const data = mergeAll(dataByCountry);
  const startingYear = data.US.map(d => d.year).reduce(
    (acc, v) => Math.min(acc, v),
    10000,
  );
  const endingYear = data.US.map(d => d.year).reduce(
    (acc, v) => Math.max(acc, v),
    0,
  );

  return {
    ...statistic,
    startingYear,
    endingYear,
    sourceAttribution: 'World Bank',
    data,
  };
}

function getConfigObject() {
  return map(
    ({ worldBankCode, unitConverter = i => i }) => ({
      worldBankCode,
      unitConverter: unitConverter(123456789.123456789),
    }),
    config,
  );
}

module.exports = {
  fetchStatisticFromWorldBank,
  WORLD_BANK_API,
  getConfigObject,
};
