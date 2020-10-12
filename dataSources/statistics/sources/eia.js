const { retryFetch } = require('./helpers');
const { SHORT_TON_TO_TON, CUBIC_FOOT_TO_CUBIC_METER } = require('./converters');

const EIA_API_KEY = '20cf4469dcd5b4da5fc7cb448d9d934e'; // TODO

const config = {
  COAL_RESERVES_GT: {
    seriesOfCountry: alpha3Code => `INTL.7-6-${alpha3Code}-MST.A`,
    unitConverter: value => (value * SHORT_TON_TO_TON) / 1000,
  },
  OIL_RESERVES_BB: {
    seriesOfCountry: alpha3Code => `INTL.57-6-${alpha3Code}-BB.A`,
  },
  GAS_RESERVES_BCM: {
    seriesOfCountry: alpha3Code => `INTL.3-6-${alpha3Code}-TCF.A`,
    unitConverter: value => value * CUBIC_FOOT_TO_CUBIC_METER * 1000,
  },
  WIND_CAPACITY_GW: {
    seriesOfCountry: alpha3Code => `INTL.37-7-${alpha3Code}-MK.A`,
  },
  SOLAR_CAPACITY_GW: {
    seriesOfCountry: alpha3Code => `INTL.116-7-${alpha3Code}-MK.A`,
  },
  NUCLEAR_CAPACITY_GW: {
    seriesOfCountry: alpha3Code => `INTL.27-7-${alpha3Code}-MK.A`,
  },
  FOSSIL_FUELS_CAPACITY_GW: {
    seriesOfCountry: alpha3Code => `INTL.28-7-${alpha3Code}-MK.A`,
  },
  WIND_GENERATION_TWH: {
    seriesOfCountry: alpha3Code => `INTL.37-12-${alpha3Code}-BKWH.A`,
  },
  SOLAR_GENERATION_TWH: {
    seriesOfCountry: alpha3Code => `INTL.116-12-${alpha3Code}-BKWH.A`,
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
  id: 'eia',
  fetchCountryStatistic: fetchCountryStatisticFromEIA,
  attribution: 'EIA',
};
