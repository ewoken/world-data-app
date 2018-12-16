const { mergeAll, map } = require('ramda');

const { retryFetch } = require('./helpers');
const { independentCountries } = require('../countries');
const {
  generationToConsumption,
  // eslint-disable-next-line camelcase
  convert_TWh_to_Mtoe,
} = require('./converters');

const EIA_API_KEY = '20cf4469dcd5b4da5fc7cb448d9d934e'; // TODO
const EIA_API = 'EIA_API';

const BKWHConverter = value =>
  Number(generationToConsumption(convert_TWh_to_Mtoe(value)).toFixed(2));

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
  HYDRO_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.33-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  NUCLEAR_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.27-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  NON_HYDRO_RENEWABLES_CONSUMPTION_MTOE: {
    seriesOfCountry: alpha3Code => `INTL.34-12-${alpha3Code}-BKWH.A`,
    unitConverter: BKWHConverter,
  },
  PRIMARY_ENERGY_MTOE: {
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
  const { seriesOfCountry, unitConverter = i => i } = config[statisticCode];
  const seriesId = seriesOfCountry(country.alpha3Code);
  const data = await retryFetch(
    `http://api.eia.gov/series/?api_key=${EIA_API_KEY}&series_id=${seriesId}`,
  );

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

async function fetchStatisticFromEIA(statistic) {
  const statisticCode = statistic.code;
  const dataByCountry = await Promise.all(
    independentCountries.map(country =>
      fetchCountryStatisticFromEIA(statisticCode, country).then(data => ({
        [country.alpha2Code]: data,
      })),
    ),
  );

  const data = mergeAll(dataByCountry);
  const startingYear = data.US.map(d => d.year).reduce(
    (acc, v) => Math.min(acc, v),
    10000,
  );
  const endingYear = data.US.map(d => d.year).reduce(
    (acc, v) => Math.max(acc, v),
    0,
  );

  return {
    ...statistic,
    startingYear,
    endingYear,
    sourceAttribution: 'EIA',
    data,
  };
}

function getConfigObject() {
  return map(
    ({ seriesOfCountry, unitConverter = i => i }) => ({
      seriesOfCountry: seriesOfCountry('TEST'),
      unitConverter: unitConverter(123456789.123456789),
    }),
    config,
  );
}

module.exports = {
  EIA_API,
  fetchStatisticFromEIA,
  getConfigObject,
};
