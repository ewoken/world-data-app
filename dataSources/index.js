const fs = require('fs');
const { forEachObjIndexed } = require('ramda');
const { countries } = require('./countries');
const statistics = require('./statistics');
const { fetchStatisticFromSource } = require('./api');

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

    const statisticPath = `./data/${statistic.code}`;
    if (!fs.existsSync(statisticPath)) {
      fs.mkdirSync(statisticPath);
    }

    forEachObjIndexed((values, countryCode) => {
      fs.writeFileSync(
        `${statisticPath}/${countryCode}.json`,
        JSON.stringify(values),
      );
    }, dataByCountry);

    const data = Object.keys(dataByCountry).reduce((acc, countryCode) => {
      const countryData = dataByCountry[countryCode].map(d => ({
        ...d,
        countryCode,
      }));
      return acc.concat(countryData);
    }, []);

    const filename = `${statisticPath}/all.json`;
    console.log(`Write ${filename}`);
    fs.writeFileSync(filename, JSON.stringify(data));
    return stats;
  }, Promise.resolve([]));

  console.log('Write statistics.json');
  fs.writeFileSync('./data/statistics.json', JSON.stringify(fullStatistics));
}

generateData().catch(err => {
  console.error(err);
  process.exit(1);
});
