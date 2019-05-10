const { memoizeWith, map } = require('ramda');
const { retryFetch } = require('./helpers');

const config = {
  HUMAN_DEVELOPMENT_INDEX: '137506',
  INEQUALITY_ADJUSTED_HDI: '138806',
};

async function fetchStatisticFromHDRO(statisticCode) {
  const statisticId = config[statisticCode];

  if (!statisticId) {
    throw new Error(`Statistic ${statisticCode} not configured for HDRO`);
  }

  const res = await retryFetch(
    `http://ec2-54-174-131-205.compute-1.amazonaws.com/API/HDRO_API.php/indicator_id=${statisticId}`,
  );
  const data = await res.json();

  const dataByCountry = map(
    value => {
      const statValue = value[statisticId];
      return Object.keys(statValue).map(year => ({
        value: statValue[year],
        year: Number(year),
      }));
    },

    data.indicator_value,
  );

  return dataByCountry;
}

const memoizedFetchStatisticFromHDRO = memoizeWith(
  i => i,
  fetchStatisticFromHDRO,
);

async function fetchCountryStatisticFromHDRO(statisticCode, country) {
  const dataByCountry = await memoizedFetchStatisticFromHDRO(statisticCode);

  return dataByCountry[country.alpha3Code] || [];
}

module.exports = {
  id: 'hdro',
  fetchCountryStatistic: fetchCountryStatisticFromHDRO,
  attribution: 'HDRO',
};
