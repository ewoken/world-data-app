import { retryFetch } from '../helpers';

const EIA_API_KEY = process.env.REACT_APP_EIA_API_KEY;
export const EIA_API = 'EIA_API';

function parseValue(value) {
  if (value === '(s)') {
    return 0;
  }
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) {
    return null;
  }
  return value;
}

export async function fetchStatisticFromEIA(statistic, country) {
  const seriesId = statistic.seriesOfCountry(country);
  const response = await retryFetch(
    `http://api.eia.gov/series/?api_key=${EIA_API_KEY}&series_id=${seriesId}`,
  );
  const data = await response.json();

  if (
    data.data &&
    data.data.error &&
    data.data.error.startsWith('invalid series_id')
  ) {
    return [];
  }

  return data.series[0].data.map(d => {
    const value = parseValue(d[1]);
    return {
      statisticCode: statistic.code,
      countryCode: country.alpha2Code,
      year: Number(d[0]),
      value: value !== null ? statistic.unitConverter(value) : null,
    };
  });
}
