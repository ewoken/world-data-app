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
};

async function fetchStatisticFromIEA(statisticCode) {
  const statisticConfig = config[statisticCode];

  if (!statisticConfig) {
    throw new Error(`Statistic ${statisticCode} not configured for World Bank`);
  }

  const { ieaId } = statisticConfig;

  const data = await retryFetch(
    `http://energyatlas.iea.org/DataServlet?edition=WORLD&lang=en&datasets=${ieaId}&cmd=getdatavalues`,
  );
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

module.exports = {
  apiCode: IEA_API,
  fetchStatistic: fetchStatisticFromIEA,
  sourceAttribution: 'IEA',
};
