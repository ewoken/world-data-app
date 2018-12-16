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

async function fetchStatisticFromIEA(statistic) {
  const statisticCode = statistic.code;
  const { ieaId } = config[statisticCode];

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

  const startingYear = dataByCountry.US.map(d => d.year).reduce(
    (acc, v) => Math.min(acc, v),
    10000,
  );
  const endingYear = dataByCountry.US.map(d => d.year).reduce(
    (acc, v) => Math.max(acc, v),
    0,
  );

  return {
    ...statistic,
    startingYear,
    endingYear,
    sourceAttribution: 'IEA',
    data: dataByCountry,
  };
}

function getConfigObject() {
  return config;
}

module.exports = {
  IEA_API,
  fetchStatisticFromIEA,
  getConfigObject,
};
