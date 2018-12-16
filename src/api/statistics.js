import { fetchJSON } from './helpers';

export function getAllStatistics() {
  return fetchJSON('/data/statistics.json');
}

export function getStatisticOfCountry(statisticCode, countryCode) {
  return fetchJSON(`/data/${statisticCode}/${countryCode}.json`);
}

export function getStatisticOfAllCountries(statisticCode) {
  return fetchJSON(`/data/${statisticCode}/all.json`);
}
