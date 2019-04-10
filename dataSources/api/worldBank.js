const { retryFetch } = require('./helpers');

const WORLD_BANK_API = 'WORLD_BANK_API';

const config = {
  POPULATION: {
    worldBankCode: 'SP.POP.TOTL',
    unitConverter: value => value / 10 ** 6,
    maxYear: 2017,
  },
  GDP_2010_USD: {
    worldBankCode: 'NY.GDP.MKTP.KD',
    unitConverter: value => value / 10 ** 9,
  },
  // CO2_EMISSIONS_MT: {
  //   worldBankCode: 'EN.ATM.CO2E.KT',
  //   unitConverter: value => value / 10 ** 3,
  //   maxYear: 2014,
  // },
};

async function fetchCountryStatisticFromWorldBank(statisticCode, country) {
  const statisticConfig = config[statisticCode];

  if (!statisticConfig) {
    throw new Error(`Statistic ${statisticCode} not configured for World Bank`);
  }

  const { worldBankCode, unitConverter = i => i } = statisticConfig;
  const { alpha2Code } = country;

  const res = await retryFetch(
    `http://api.worldbank.org/v2/countries/${alpha2Code}/indicators/${worldBankCode}?format=json&per_page=100`,
  );
  const data = await res.json();

  if (!data[1]) {
    return [];
  }

  const parsedData = data[1].map(object => ({
    year: Number(object.date),
    value: unitConverter(object.value),
  }));

  if (statisticConfig.maxYear) {
    return parsedData.filter(d => d.year <= statisticConfig.maxYear);
  }
  return parsedData;
}

module.exports = {
  apiCode: WORLD_BANK_API,
  fetchCountryStatistic: fetchCountryStatisticFromWorldBank,
  sourceAttribution: 'World Bank',
};
