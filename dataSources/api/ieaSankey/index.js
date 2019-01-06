const { memoizeWith } = require('ramda');

const { retryFetch } = require('../helpers');
const { parseBalanceFile, getSourceByCountry } = require('./helpers');
const computeStatistic = require('./computeStatistic');

const IEA_SANKEY_API = 'IEA_SANKEY_API';

const memoizedGetSourceByCountry = memoizeWith(i => i, getSourceByCountry);

async function getCountryBalanceData(countryCode) {
  const sourcefileByCountry = await memoizedGetSourceByCountry();
  const sourceFile = sourcefileByCountry[countryCode];

  if (!sourceFile) {
    return null;
  }

  const res = await retryFetch(`https://www.iea.org/sankey/${sourceFile}`);
  const data = await res.text();
  const countryStatistics = parseBalanceFile(data);

  return countryStatistics;
}
const memoizedGetCountryBalanceData = memoizeWith(
  i => i,
  getCountryBalanceData,
);

async function fetchCountryStatisticFromIEASankey(statisticCode, country) {
  const balanceData = await memoizedGetCountryBalanceData(country.alpha2Code);

  return computeStatistic(statisticCode, balanceData);
}

module.exports = {
  apiCode: IEA_SANKEY_API,
  fetchCountryStatistic: fetchCountryStatisticFromIEASankey,
  sourceAttribution: 'IEA',
  sourceUrl: 'https://www.iea.org/sankey/',
};
