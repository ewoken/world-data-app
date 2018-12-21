const { range, mapObjIndexed, values, groupBy, mergeAll } = require('ramda');
const { MTOE_TO_TWH, POWER_PLANT_EFFICIENCIES } = require('../converters');

const ZEROS = range(1973, 2017).map(year => ({ year, value: 0 }));
const NULLS = range(1973, 2017).map(year => ({ year, value: null }));

const statisticCodeMap = {
  NUCLEAR_PRODUCTION_MTOE: '118',
  HYDRO_PRODUCTION_MTOE: '115',
  BIOFUELS_WASTE_CONSUMPTION_MTOE: {
    sources: {
      biofuelsProd: '70',
      biofuelsImport: '71',
      biofuelsStockBuild: '72',
      biofuelsStockDraw: '73',
      biofuelsStatMinus: '74',
      biofuelsStatPlus: '75',
      biofuelsExport: '76',
    },
    computeStatistic(sources) {
      return (
        sources.biofuelsProd +
        sources.biofuelsImport +
        sources.biofuelsStockDraw +
        sources.biofuelsStatPlus -
        sources.biofuelsStockBuild -
        sources.biofuelsStatMinus -
        sources.biofuelsExport
      );
    },
  },
  GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE: {
    sources: {
      geothProd: '98',
      geothStatMinus: '100',
      geothStatPlus: '101',
      solarTideWindProd: '106',
      solarTideWindStatMinus: '108',
      solarTideWindStatPlus: '109',
    },
    computeStatistic(sources) {
      return (
        sources.geothProd +
        sources.geothStatPlus +
        sources.solarTideWindProd +
        sources.solarTideWindStatPlus -
        sources.geothStatMinus -
        sources.solarTideWindStatMinus
      );
    },
  },
  OIL_ELECTRICITY_GENERATION_TWH: {
    sources: {
      oil: '13',
      oilProducts: '25',
    },
    computeStatistic({ oil, oilProducts }) {
      return (oil + oilProducts) * POWER_PLANT_EFFICIENCIES.OIL * MTOE_TO_TWH;
    },
  },
  GAS_ELECTRICITY_GENERATION_TWH: {
    sources: {
      gas: '64',
    },
    computeStatistic({ gas }) {
      return gas * POWER_PLANT_EFFICIENCIES.GAS * MTOE_TO_TWH;
    },
  },
  COAL_ELECTRICITY_GENERATION_TWH: {
    sources: {
      coal: '47',
    },
    computeStatistic({ coal }) {
      return coal * POWER_PLANT_EFFICIENCIES.COAL * MTOE_TO_TWH;
    },
  },
  BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH: {
    sources: {
      input: '81',
    },
    computeStatistic({ input }) {
      return input * POWER_PLANT_EFFICIENCIES.BIOFUELS_WASTE * MTOE_TO_TWH;
    },
  },
  GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH: {
    sources: {
      geoth: '99',
      solarWindTide: '107',
    },
    computeStatistic({ geoth, solarWindTide }) {
      return (
        (geoth * POWER_PLANT_EFFICIENCIES.GEOTHERMY +
          solarWindTide * POWER_PLANT_EFFICIENCIES.SOLAR) *
        MTOE_TO_TWH
      );
    },
  },
};

function getBalanceStat(balanceData, code) {
  const stat = balanceData[code];
  return stat ? stat.values : ZEROS;
}

function computeValues(balanceData, statisticConfig) {
  const { sources: sourceMap, computeStatistic: compute } = statisticConfig;

  const mapOfNamedSourceValues = mapObjIndexed((code, sourceName) => {
    const balanceStat = getBalanceStat(balanceData, code);

    return balanceStat.map(({ year, value }) => ({
      year,
      [sourceName]: value,
    }));
  }, sourceMap);

  const allValues = [].concat(...values(mapOfNamedSourceValues));
  const allValuesByYear = groupBy(value => value.year, allValues);
  const statisticValues = Object.keys(allValuesByYear)
    .sort()
    .map(year => mergeAll(allValuesByYear[year]))
    .map(({ year, ...sources }) => ({
      year,
      value: compute(sources),
    }));
  return statisticValues;
}

function computeStatistic(statisticCode, balanceData) {
  if (!balanceData) {
    return NULLS;
  }

  const config = statisticCodeMap[statisticCode];
  if (typeof config === 'string') {
    return getBalanceStat(balanceData, config);
  }

  return computeValues(balanceData, config);
}

module.exports = computeStatistic;
