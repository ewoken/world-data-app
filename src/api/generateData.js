import * as fs from 'fs';
import { equals } from 'ramda';

import getAllCountries from './country';
import { getAllStatistics, getStatisticOfCountry } from './statistics';

const statisticCacheFile = './data/statisticsCache.json';

function computeTest(statistic) {
  const { unitConverter = i => i, seriesOfCountry, ...rest } = statistic;

  return {
    ...rest,
    unitConverterTest: unitConverter(123456789.123456789),
    ...(seriesOfCountry
      ? { seriesOfCountryTest: seriesOfCountry({ alpha3Code: 'TEST' }) }
      : {}),
  };
}
let statisticCacheData = [];

if (fs.existsSync(statisticCacheFile)) {
  statisticCacheData = JSON.parse(fs.readFileSync(statisticCacheFile));
}

async function generateData() {
  const countries = await getAllCountries();
  const statistics = await getAllStatistics();

  await statistics.reduce(async (p, statistic) => {
    await p;

    const statisticCache = statisticCacheData.find(
      s => s.code === statistic.code,
    );
    if (statisticCache && equals(statisticCache, computeTest(statistic))) {
      console.log(`Get ${statistic.code} from cache`);
      return Promise.resolve();
    }

    console.log(`Fetching ${statistic.code}`);
    const dataByCountry = await Promise.all(
      countries.map(country =>
        getStatisticOfCountry(statistic, country).then(values =>
          values.map(value => ({
            ...value,
            countryCode: country.alpha2Code,
          })),
        ),
      ),
    );
    const data = [].concat(...dataByCountry);
    const filename = `./data/${statistic.code}.json`;
    console.log(`Write ${filename}`);
    fs.writeFileSync(filename, JSON.stringify(data));
    return Promise.resolve();
  }, Promise.resolve());

  const statisticsData = statistics.map(computeTest);
  console.log('Write statistic cache');
  fs.writeFileSync(statisticCacheFile, JSON.stringify(statisticsData, null, 2));
}

generateData().catch(err => {
  console.error(err);
  process.exit(1);
});
