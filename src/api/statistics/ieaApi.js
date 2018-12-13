import { retryFetch } from '../helpers';

export const IEA_API = 'IEA_API';
const cache = {};

export function fetchStatisticFromIEA(statistic, country) {
  const { ieaId } = statistic;

  if (!cache[ieaId]) {
    cache[ieaId] = retryFetch(
      `http://energyatlas.iea.org/DataServlet?edition=WORLD&lang=en&datasets=${ieaId}&cmd=getdatavalues`,
    )
      .then(data => data.datasets[ieaId].values)
      .then(years =>
        Object.keys(years).reduce((map1, year) => {
          const countriesOfYear = years[year];

          return Object.keys(countriesOfYear).reduce(
            (map, countryAlpha3Code) => {
              const { value } = countriesOfYear[countryAlpha3Code];
              const item = { year: Number(year), value };

              if (map[countryAlpha3Code]) {
                map[countryAlpha3Code].push(item);
              } else {
                // eslint-disable-next-line no-param-reassign
                map[countryAlpha3Code] = [item];
              }
              return map;
            },
            map1,
          );
        }, {}),
      );
  }

  return cache[ieaId].then(
    countryValues => countryValues[country.alpha3Code] || [],
  );
}
