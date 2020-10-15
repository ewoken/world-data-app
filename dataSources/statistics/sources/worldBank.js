const { retryFetch } = require('./helpers');

const config = {
  POPULATION: {
    worldBankCode: 'SP.POP.TOTL',
    unitConverter: value => value / 10 ** 6,
    maxYear: 2018,
  },
  GDP_2010_USD: {
    worldBankCode: 'NY.GDP.MKTP.KD',
    unitConverter: value => value / 10 ** 9,
  },
  GDP_USD: {
    worldBankCode: 'NY.GDP.MKTP.CD',
    unitConverter: value => value / 10 ** 9,
  },
  COAL_RENTS_IN_GDP: {
    worldBankCode: 'NY.GDP.COAL.RT.ZS',
  },
  OIL_RENTS_IN_GDP: {
    worldBankCode: 'NY.GDP.PETR.RT.ZS',
  },
  GAS_RENTS_IN_GDP: {
    worldBankCode: 'NY.GDP.NGAS.RT.ZS',
  },
  SHARE_CO2_EMISSIONS_FROM_ELECTRICITY_HEAT: {
    worldBankCode: 'EN.CO2.ETOT.ZS',
  },
  TOTAL_GHG_EMISSIONS: {
    worldBankCode: 'EN.ATM.GHGT.KT.CE',
    unitConverter: value => value / 10 ** 3,
  },
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
  id: 'worldBank',
  fetchCountryStatistic: fetchCountryStatisticFromWorldBank,
  attribution: 'World Bank',
};
