import { fetchJSON } from './helpers';
import derivedStatistics from './derivedStatistics';

export function getAllStatistics() {
  return fetchJSON('/data/statistics.json').then(statistics =>
    statistics.concat(derivedStatistics),
  );
}

export function getStatisticOfCountry(statisticCode, countryCode) {
  return fetchJSON(`/data/${statisticCode}/${countryCode}.json`);
}

export function getStatisticOfAllCountries(statisticCode) {
  return fetchJSON(`/data/${statisticCode}/all.json`);
}
