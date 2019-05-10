const { mergeAll, indexBy, range, groupBy, values } = require('ramda');

const sources = require('./sources');
const statisticConfigs = require('./config');

const DEFAULT_STARTING_YEAR = 1973;
const DEFAULT_ENDING_YEAR = 2016;

function formatDataArray({ startingYear, endingYear, data, countryLastYear }) {
  const dataByYear = indexBy(d => d.year, data);
  const years = range(startingYear, endingYear + 1);
  const lastYear = countryLastYear || endingYear;

  return years.map(year => ({
    year,
    value: dataByYear[year] && year <= lastYear ? dataByYear[year].value : null,
  }));
}

function aggregate(dataById, ids, isIntensive = false) {
  const allData = ids
    ? [].concat(...ids.map(id => dataById[id] || []))
    : [].concat(...values(dataById));

  const dataNotNull = allData.filter(d => d.value !== null);
  const dataByYear = groupBy(d => d.year, dataNotNull);

  const res = Object.keys(dataByYear).map(year => ({
    year: Number(year),
    value: dataByYear[year].reduce((sum, d) => sum + d.value, 0),
  }));

  return isIntensive ? res.map(r => ({ ...r, value: null })) : res;
}

async function fetchStatistic(statisticConfig, context) {
  const {
    source: sourceId,
    startingYear = DEFAULT_STARTING_YEAR,
    endingYear = DEFAULT_ENDING_YEAR,
    ...statistic
  } = statisticConfig;
  const { countries, areas, logger } = context;
  logger.info(`Fetch ${statistic.code}`);

  const source = sources[sourceId];

  if (!source) {
    throw new Error(`Unknown source : ${sourceId}`);
  }

  const countryDataObjects = await Promise.all(
    countries.map(country =>
      source.fetchCountryStatistic(statistic.code, country).then(data => ({
        [country.alpha2Code]: formatDataArray({
          startingYear,
          endingYear,
          countryLastYear: country.lastYear,
          data,
        }),
      })),
    ),
  );
  const dataByCountry = mergeAll(countryDataObjects);
  const dataByArea = mergeAll(
    areas.map(area => ({
      [area.code]: aggregate(
        dataByCountry,
        area.countryCodes,
        statistic.isIntensive,
      ),
    })),
  );

  if (statistic.code === 'POPULATION') {
    dataByCountry.SU = dataByArea.FORMER_USSR;
  }

  const indexedData = {
    ...dataByCountry,
    ...dataByArea,
  };

  return {
    ...statistic,
    startingYear,
    endingYear,
    sourceAttribution: source.attribution,
    sourceUrl: statistic.sourceUrl || source.url,
    indexedData,
  };
}

function fetchAllStatistics(context) {
  const { logger } = context;
  logger.info('Start fetching statistics...');

  return statisticConfigs.reduce(async (p, statisticConfig) => {
    const statisticsByCode = await p;
    const statistic = await fetchStatistic(statisticConfig, context);

    return {
      ...statisticsByCode,
      [statistic.code]: statistic,
    };
  }, Promise.resolve({}));
}

function fetchStatisticByCode(code, context) {
  const statisticConfig = statisticConfigs.find(s => s.code === code);

  return fetchStatistic(statisticConfig, context);
}

module.exports = {
  fetchAllStatistics,
  fetchStatisticByCode,
};
