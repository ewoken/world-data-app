import { retryFetch } from '../helpers';

import { EIA_API, fetchStatisticFromEIA } from './eiaApi';
import { IEA_API, fetchStatisticFromIEA } from './ieaApi';
import { WORLD_BANK_API, fetchStatisticFromWorldBank } from './worldBankApi';
import statistics from './statistics';

export function getAllStatistics() {
  return Promise.resolve(statistics);
}

// TODO statisticCode ?
export function getStatisticOfCountry(statistic, country) {
  switch (statistic.api) {
    case EIA_API:
      return fetchStatisticFromEIA(statistic, country);
    case IEA_API:
      return fetchStatisticFromIEA(statistic, country);
    case WORLD_BANK_API:
      return fetchStatisticFromWorldBank(statistic, country);
    default:
      return Promise.resolve([]);
  }
}

export function getStatisticOfAllCountries(statisticCode) {
  return retryFetch(`data/${statisticCode}.json`);
}
