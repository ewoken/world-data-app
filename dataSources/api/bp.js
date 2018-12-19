const fs = require('fs');
const { memoizeWith, groupBy } = require('ramda');
const { parseCSV } = require('./helpers');

const BP_API = 'BP_API';

const config = {
  ELECTRICTY_GENERATION_BY_COAL_TWH: 'electbyfuel_coal',
};

function fetchBPDatafile() {
  const csv = fs.readFileSync('./data/2018_bpData.csv');

  return groupBy(d => d.Fuel, parseCSV(String(csv)));
}
const memoizedFetchDataFile = memoizeWith(i => i, fetchBPDatafile);

async function fetchCountryStatisticFromBP(statisticCode, country) {
  const dataByFuel = memoizedFetchDataFile();
  const fuel = config[statisticCode];

  if (!fuel) {
    throw new Error(`Statistic ${statisticCode} not configured for BP`);
  }
  const statisticData = dataByFuel[fuel];
  const dataByCountry = statisticData.filter(
    d => d.ISO3166_alpha3 === country.alpha3Code,
  );

  return dataByCountry;
}

fetchCountryStatisticFromBP('ELECTRICTY_GENERATION_BY_COAL_TWH', {
  alpha3Code: 'USA',
}).then(data => console.log(data));

module.exports = {
  apiCode: BP_API,
  fetchCountryStatistic: fetchCountryStatisticFromBP,
  sourceAttribution: 'BP Statistical Review',
};
