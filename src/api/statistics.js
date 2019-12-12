import { fetchJSON } from './helpers';
import derivedStatistics from './derivedStatistics';

export function getAllStatistics() {
  return fetchJSON(`${process.env.PUBLIC_URL}/data/statistics.json`).then(
    statistics => statistics.concat(derivedStatistics),
  );
}

export function getStatisticOfCountry(statisticCode, countryCode) {
  return fetchJSON(
    `${process.env.PUBLIC_URL}/data/${statisticCode}/${countryCode}.json`,
  );
}

export function getStatisticOfAllCountries(statisticCode) {
  return fetchJSON(`${process.env.PUBLIC_URL}/data/${statisticCode}/all.json`);
}
