const { memoizeWith } = require('ramda');
const { retryFetch } = require('./helpers');

const config = {
  OIL_PRODUCTION_MTOE: {
    ieaId: '-21319742',
  },
  OIL_CONSUMPTION_MTOE: {
    ieaId: '642753284',
  },
  GAS_PRODUCTION_MTOE: {
    ieaId: '315313026',
  },
  GAS_CONSUMPTION_MTOE: {
    ieaId: '2053304192',
  },
  COAL_PRODUCTION_MTOE: {
    ieaId: '1206244417',
  },
  COAL_CONSUMPTION_MTOE: {
    ieaId: '673476799',
  },
  PRIMARY_ENERGY_CONSUMPTION_MTOE: {
    ieaId: '-943463622',
  },
  PRIMARY_ENERGY_PRODUCTION_MTOE: {
    ieaId: '1890877781',
  },
  ELECTRICITY_GENERATION_TWH: {
    ieaId: '-361163217',
  },
  FINAL_ENERGY_CONSUMPTION_MTOE: {
    ieaId: '-44311105',
  },
  FOSSIL_CO2_EMISSIONS_MT: {
    ieaId: '-573878429',
  },
};

async function fetchStatisticFromIEA(statisticCode) {
  const statisticConfig = config[statisticCode];

  if (!statisticConfig) {
    throw new Error(`Statistic ${statisticCode} not configured for World Bank`);
  }

  const { ieaId } = statisticConfig;

  const res = await retryFetch(
    `http://energyatlas.iea.org/DataServlet?edition=WORLD&lang=en&datasets=${ieaId}&cmd=getdatavalues`,
  );
  const data = await res.json();
  const years = data.datasets[ieaId].values;

  const dataByCountry = Object.keys(years).reduce((map, year) => {
    const countriesOfYear = years[year];
    return Object.keys(countriesOfYear).reduce((map2, alpha3Code) => {
      const countryData = map[alpha3Code] || [];
      return {
        ...map2,
        [alpha3Code]: [
          ...countryData,
          { year: Number(year), value: countriesOfYear[alpha3Code].value },
        ],
      };
    }, map);
  }, {});

  return dataByCountry;
}
const memoizedFetchStatisticFromIEA = memoizeWith(
  i => i,
  fetchStatisticFromIEA,
);

async function fetchCountryStatisticFromIEA(statisticCode, country) {
  const dataByCountry = await memoizedFetchStatisticFromIEA(statisticCode);

  return dataByCountry[country.alpha3Code] || [];
}

module.exports = {
  id: 'iea',
  fetchCountryStatistic: fetchCountryStatisticFromIEA,
  attribution: 'IEA',
};
