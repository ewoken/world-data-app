const fs = require('fs');
const { forEachObjIndexed, groupBy, indexBy, map } = require('ramda');
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

async function generateData() {
  fs.writeFileSync('./data/countries.json', JSON.stringify(countries));

  const fullStatistics = await statistics.reduce(async (p, statistic) => {
    const stats = await p;

    console.log(`Fetching ${statistic.code}`);
    const {
      data: dataByCountry,
      ...fullStatistic
    } = await fetchStatisticFromSource(statistic);
    stats.push(fullStatistic);

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
    return stats;
  }, Promise.resolve([]));

  console.log('Write statistics.json');
  fs.writeFileSync('./data/statistics.json', JSON.stringify(fullStatistics));
}

generateData().catch(err => {
  console.error(err);
  process.exit(1);
});
