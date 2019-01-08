const { mergeAll } = require('ramda');

const ieaAPI = require('./iea');
const worldBankAPI = require('./worldBank');
const eiaAPI = require('./eia');
const ieaSankey = require('./ieaSankey');
const { independentCountries } = require('../countries');

const apis = [eiaAPI, ieaAPI, worldBankAPI, ieaSankey];

async function fetchStatisticForAllCountries(statistic, api) {
  const dataByCountry = await Promise.all(
    independentCountries.map(country =>
      api.fetchCountryStatistic(statistic.code, country).then(data => ({
        [country.alpha2Code]: data,
      })),
    ),
  );

  return mergeAll(dataByCountry);
}

async function fetchStatisticFromSource(statistic) {
  const api = apis.find(a => a.apiCode === statistic.source);

  if (!api) {
    throw new Error('Unknown source');
  }

  const data = await fetchStatisticForAllCountries(statistic, api);

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
    sourceAttribution: api.sourceAttribution,
    sourceUrl: statistic.sourceUrl || api.sourceUrl,
    data,
  };
}

module.exports = {
  fetchStatisticFromSource,
};