const { retryFetch } = require('./helpers');
const {
  TWH_TO_MTOE,
  GENERATION_TO_CONSUMPTION_FACTOR,
} = require('./converters');

const EIA_API_KEY = '20cf4469dcd5b4da5fc7cb448d9d934e'; // TODO
const EIA_API = 'EIA_API';

const BKWHConverter = value =>
  Number(value * TWH_TO_MTOE * GENERATION_TO_CONSUMPTION_FACTOR).toFixed(2);

const config = {
  COAL_PRODUCTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.7-1-${alpha3Code}-MTOE.A`,
  },
  COAL_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.7-2-${alpha3Code}-MTOE.A`,
  },
  GAS_PRODUCTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.26-1-${alpha3Code}-MTOE.A`,
  },
  GAS_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.26-2-${alpha3Code}-MTOE.A`,
  },
  HYDRO_PRODUCTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.33-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  NUCLEAR_PRODUCTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.27-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  OTHER_RENEWABLES_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.34-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  PRIMARY_ENERGY_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.44-2-${alpha3Code}-MTOE.A`,
  },
};

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

async function fetchCountryStatisticFromEIA(statisticCode, country) {
  const statisticConfig = config[statisticCode];

  if (!statisticConfig) {
    throw new Error(`Statistic ${statisticCode} not configured for EIA`);
  }

  const { seriesOfCountry, unitConverter = i => i } = statisticConfig;
  const seriesId = seriesOfCountry(country.alpha3Code);
  const res = await retryFetch(
    `http://api.eia.gov/series/?api_key=${EIA_API_KEY}&series_id=${seriesId}`,
  );
  const data = await res.json();

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
      year: Number(d[0]),
      value: value !== null ? unitConverter(value) : null,
    };
  });
}

module.exports = {
  apiCode: EIA_API,
  fetchCountryStatistic: fetchCountryStatisticFromEIA,
  sourceAttribution: 'EIA',
};
