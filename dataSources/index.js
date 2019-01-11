const fs = require('fs');
const { forEachObjIndexed, groupBy, indexBy, map, omit } = require('ramda');
const { countries } = require('./countries');
const statistics = require('./statistics');
const { fetchStatisticFromSource } = require('./api');
const areas = require('./areas.json');

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

async function generateData() {
  const fullStatistics = await statistics.reduce(async (p, statistic) => {
    const stats = await p;

    console.log(`Fetching ${statistic.code}`);
    const fullStatistic = await fetchStatisticFromSource(statistic);
    const dataByCountry = fullStatistic.data;

    const statisticPath = assertStatisticPath(statistic.code);
    writeFiles(statisticPath, dataByCountry);

    const countriesData = Object.keys(dataByCountry).reduce(
      (acc, countryCode) => {
        const countryData = dataByCountry[countryCode].map(d => ({
          ...d,
          countryCode,
        }));
        return acc.concat(countryData);
      },
      [],
    );

    const dataByYear = groupBy(d => d.year, countriesData);
    const areasData = areas.map(area => {
      const areaData = Object.keys(dataByYear).reduce((acc, year) => {
        const countryValues = dataByYear[year].filter(
          data =>
            // !area.countryCode is for WOLRD
            !area.countryCodes || area.countryCodes.includes(data.countryCode),
        );
        const value = countryValues.reduce((sum, d) => sum + d.value, 0);

        return [...acc, { year: Number(year), value }];
      }, []);

      return { areaCode: area.code, data: areaData };
    });
    const dataByArea = map(d => d.data, indexBy(d => d.areaCode, areasData));
    const worldData = dataByArea.WORLD;

    writeFiles(statisticPath, dataByArea);

    const allData = countriesData.concat(
      worldData.map(d => ({ ...d, countryCode: 'WORLD' })),
    );
    const filename = `${statisticPath}/all.json`;
    console.log(`Write ${filename}`);
    fs.writeFileSync(filename, JSON.stringify(allData));

    stats.push({
      ...fullStatistic,
      dataByArea,
    });
    return stats;
  }, Promise.resolve([]));

  const fullStatisticByCode = indexBy(s => s.code, fullStatistics);
  const check = countryCode => code =>
    !!fullStatisticByCode[code].data[countryCode] &&
    fullStatisticByCode[code].data[countryCode].some(d => d.value > 0.01);
  const countriesData = countries.map(country => ({
    ...country,
    hasProduced: map(check(country.alpha2Code), hasProducedMap),
    hasConsumed: map(check(country.alpha2Code), hasConsumedMap),
  }));

  fs.writeFileSync('./data/countries.json', JSON.stringify(countriesData));

  const checkArea = countryCode => code =>
    !!fullStatisticByCode[code].dataByArea[countryCode] &&
    fullStatisticByCode[code].dataByArea[countryCode].some(d => d.value > 0.01);
  const areasData = areas.map(area => ({
    ...area,
    hasProduced: map(checkArea(area.code), hasProducedMap),
    hasConsumed: map(checkArea(area.code), hasConsumedMap),
  }));
  fs.writeFileSync('./data/areas.json', JSON.stringify(areasData));

  console.log('Write statistics.json');
  fs.writeFileSync(
    './data/statistics.json',
    JSON.stringify(fullStatistics.map(omit(['data', 'dataByArea']))),
  );
}

generateData().catch(err => {
  console.error(err);
  process.exit(1);
});
