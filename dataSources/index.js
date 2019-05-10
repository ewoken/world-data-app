const fs = require('fs');
const { forEachObjIndexed, map, omit, values } = require('ramda');
const winston = require('winston');

const { independentCountries: countries } = require('./countries');
const { fetchAllStatistics, fetchStatisticByCode } = require('./statistics');
const areas = require('./areas.json');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

function assertStatisticPath(statisticCode) {
  const statisticPath = `./data/${statisticCode}`;
  if (!fs.existsSync(statisticPath)) {
    fs.mkdirSync(statisticPath);
  }
  return statisticPath;
}

function writeFiles(statisticPath, dataByKey) {
  forEachObjIndexed((countryValues, key) => {
    fs.writeFileSync(
      `${statisticPath}/${key}.json`,
      JSON.stringify(countryValues),
    );
  }, dataByKey);
}

const hasConsumedMap = {
  coal: 'COAL_CONSUMPTION_MTOE',
  gas: 'GAS_CONSUMPTION_MTOE',
  oil: 'OIL_CONSUMPTION_MTOE',
  hydro: 'HYDRO_PRODUCTION_MTOE',
  nuclear: 'NUCLEAR_PRODUCTION_MTOE',
  biofuelsWaste: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
  solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
};

const hasProducedMap = {
  coal: 'COAL_PRODUCTION_MTOE',
  gas: 'GAS_PRODUCTION_MTOE',
  oil: 'OIL_PRODUCTION_MTOE',
  hydro: 'HYDRO_PRODUCTION_MTOE',
  nuclear: 'NUCLEAR_PRODUCTION_MTOE',
  biofuelsWaste: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
  solarWindTideGeoth: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
};

function checkStat(statisticsByCode, code) {
  return statisticCode =>
    statisticsByCode[statisticCode].indexedData[code].some(d => d.value > 0.01);
}

function writeStatistic(statistic, disabledCountryCodes = []) {
  const statisticPath = assertStatisticPath(statistic.code);
  const enableIndexedData = omit(disabledCountryCodes, statistic.indexedData);

  writeFiles(statisticPath, enableIndexedData);
  const allStatisticData = Object.keys(enableIndexedData).reduce(
    (acc, key) =>
      acc.concat(enableIndexedData[key].map(d => ({ ...d, countryCode: key }))),
    [],
  );

  fs.writeFileSync(
    `${statisticPath}/all.json`,
    JSON.stringify(allStatisticData),
  );
}

const context = { countries, areas, logger };

async function generateStatistic(code) {
  const statistic = await fetchStatisticByCode(code, context);

  writeStatistic(statistic);
}

async function generateData() {
  const statisticsByCode = await fetchAllStatistics(context);
  const statistics = values(statisticsByCode);

  const finalCountries = countries.map(country => {
    const disabled = !statisticsByCode.COAL_PRODUCTION_MTOE.indexedData[
      country.alpha2Code
    ].some(d => d.value !== null);
    return {
      ...country,
      disabled,
      hasProduced: map(
        checkStat(statisticsByCode, country.alpha2Code),
        hasProducedMap,
      ),
      hasConsumed: map(
        checkStat(statisticsByCode, country.alpha2Code),
        hasConsumedMap,
      ),
    };
  });
  const disabledCountryCodes = finalCountries
    .filter(c => c.disabled)
    .map(c => c.alpha2Code);

  const finalAreas = areas.map(area => ({
    ...area,
    hasProduced: map(checkStat(statisticsByCode, area.code), hasProducedMap),
    hasConsumed: map(checkStat(statisticsByCode, area.code), hasConsumedMap),
  }));

  logger.info('Write statistic files...');
  statistics.forEach(statistic => {
    writeStatistic(statistic, disabledCountryCodes);
  });

  logger.info('Write countries.json');
  fs.writeFileSync('./data/countries.json', JSON.stringify(finalCountries));

  logger.info('Write areas.json');
  fs.writeFileSync('./data/areas.json', JSON.stringify(finalAreas));

  logger.info('Write statistics.json');
  fs.writeFileSync(
    './data/statistics.json',
    JSON.stringify(statistics.map(omit(['indexedData']))),
  );
}

if (process.argv[2]) {
  generateStatistic(process.argv[2]).catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  generateData().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
