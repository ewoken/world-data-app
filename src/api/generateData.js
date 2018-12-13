import * as fs from 'fs';

import getAllCountries from './country';
import { getAllStatistics, getStatisticOfCountry } from './statistics';

async function generateData() {
  const countries = await getAllCountries();
  const statistics = await getAllStatistics();

  await Promise.all(
    statistics.map(statistic => {
      console.log(statistic.code);
      return Promise.all(
        countries.map(country =>
          getStatisticOfCountry(statistic, country).then(values =>
            values.map(value => ({
              ...value,
              countryCode: country.alpha2Code,
            })),
          ),
        ),
      )
        .then(dataByCountry => [].concat(...dataByCountry))
        .then(
          data =>
            new Promise((resolve, reject) => {
              const file = `./data/${statistic.code}.json`;
              console.log(`Write ${file}`);
              fs.writeFile(file, JSON.stringify(data), err => {
                if (err) reject(err);
                resolve();
              });
            }),
        );
    }),
  );
}

generateData().catch(err => {
  console.error(err);
  process.exit(1);
});
