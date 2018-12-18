const { memoizeWith } = require('ramda');
const { retryFetch } = require('./helpers');
const { independentCountries } = require('../countries');

const IEA_API = 'IEA_API';

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
  PRIMARY_ENERGY_MTOE: {
    ieaId: '-943463622',
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

  const dataByCountry = independentCountries.reduce((map, country) => {
    const { alpha3Code, alpha2Code } = country;
    const countryData = [];

    Object.keys(years).forEach(year => {
      const countriesOfYear = years[year];

      if (countriesOfYear[alpha3Code]) {
        countryData.push({
          year: Number(year),
          value: countriesOfYear[alpha3Code].value,
        });
      }
    });

    return {
      ...map,
      [alpha2Code]: countryData,
    };
  }, {});

  return dataByCountry;
}
const memoizedFetchStatisticFromIEA = memoizeWith(
  i => i,
  fetchStatisticFromIEA,
);

async function fetchCountryStatisticFromIEA(statisticCode, country) {
  const dataByCountry = await memoizedFetchStatisticFromIEA(statisticCode);

  return dataByCountry[country.alpha2Code];
}

module.exports = {
  apiCode: IEA_API,
  fetchCountryStatistic: fetchCountryStatisticFromIEA,
  sourceAttribution: 'IEA',
};
