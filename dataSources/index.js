const fs = require('fs');
const { forEachObjIndexed, groupBy } = require('ramda');
const { countries } = require('./countries');
const statistics = require('./statistics');
const { fetchStatisticFromSource } = require('./api');

function assertStatisticPath(statisticCode) {
  const statisticPath = `./data/${statisticCode}`;
  if (!fs.existsSync(statisticPath)) {
    fs.mkdirSync(statisticPath);
  }
  return statisticPath;
}

function writeCountryFiles(statisticPath, dataByCountry) {
  forEachObjIndexed((countryValues, countryCode) => {
    fs.writeFileSync(
      `${statisticPath}/${countryCode}.json`,
      JSON.stringify(countryValues),
    );
  }, dataByCountry);
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
    writeCountryFiles(statisticPath, dataByCountry);

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
    const worldData = Object.keys(dataByYear).reduce((acc, year) => {
      const countryValues = dataByYear[year];
      const value = countryValues.reduce((sum, d) => sum + d.value, 0);

      return [...acc, { year: Number(year), value }];
    }, []);

    fs.writeFileSync(`${statisticPath}/WORLD.json`, JSON.stringify(worldData));

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
