import { retryFetch } from '../helpers';

export const WORLD_BANK_API = 'WORLD_BANK_API';

export async function fetchStatisticFromWorldBank(statistic, country) {
  const { worldBankCode, unitConverter = i => i } = statistic;

  const data = await retryFetch(
    `http://api.worldbank.org/v2/countries/${
      country.alpha2Code
    }/indicators/${worldBankCode}?format=json&per_page=100`,
  );

  if (!data[1]) {
    return [];
  }

  return data[1].map(object => ({
    statisticCode: statistic.code,
    countryCode: country.alpha2Code,
    year: Number(object.date),
    value: unitConverter(object.value),
  }));
}
