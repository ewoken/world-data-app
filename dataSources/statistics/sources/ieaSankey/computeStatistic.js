const {
  range,
  mapObjIndexed,
  values,
  groupBy,
  mergeAll,
  map,
} = require('ramda');
const { MTOE_TO_TWH, POWER_PLANT_EFFICIENCIES } = require('../converters');

const ZEROS = range(1973, 2018).map(year => ({ year, value: 0 }));
const NULLS = range(1973, 2018).map(year => ({ year, value: null }));

function consumptionCompute({
  prod,
  impo,
  expo,
  stockBuild,
  stockDraw,
  bunkers = 0,
}) {
  return prod + impo + stockDraw - expo - stockBuild - bunkers;
}

const statisticCodeMap = {
  COAL_PRODUCTION_MTOE: '37',
  COAL_CONSUMPTION_MTOE: {
    sources: {
      prod: '37',
      impo: '38',
      stockBuild: '39',
      stockDraw: '40',
      expo: '43',
    },
    computeStatistic: consumptionCompute,
  },
  GAS_PRODUCTION_MTOE: '53',
  GAS_CONSUMPTION_MTOE: {
    sources: {
      prod: '53',
      impo: '54',
      stockBuild: '55',
      stockDraw: '56',
      expo: '59',
      bunkers: '60',
    },
    computeStatistic: consumptionCompute,
  },
  OIL_PRODUCTION_MTOE: '1',
  OIL_CONSUMPTION_MTOE: {
    sources: {
      prod: '1',
      impo: '2',
      stockBuild: '3',
      stockDraw: '4',
      expo: '7',
      productsImport: '22',
      productStockBuild: '26',
      productStockDraw: '27',
      productsExport: '30',
      bunkers: '31',
    },
    computeStatistic(sources) {
      return (
        sources.prod +
        sources.impo +
        sources.stockDraw +
        sources.productsImport +
        sources.productStockDraw -
        sources.stockBuild -
        sources.expo -
        sources.productStockBuild -
        sources.productsExport -
        sources.bunkers
      );
    },
  },
  NUCLEAR_PRODUCTION_MTOE: '118',
  HYDRO_PRODUCTION_MTOE: '115',
  BIOFUELS_WASTE_PRODUCTION_MTOE: '70',
  BIOFUELS_WASTE_CONSUMPTION_MTOE: {
    sources: {
      prod: '70',
      impo: '71',
      stockBuild: '72',
      stockDraw: '73',
      expo: '76',
    },
    computeStatistic: consumptionCompute,
  },
  GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE: {
    sources: {
      geothProd: '98',
      solarTideWindProd: '106',
    },
    computeStatistic(sources) {
      return sources.geothProd + sources.solarTideWindProd;
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
  ELECTRICITY_GENERATION_TWH: {
    sources: {
      electricity: '89',
    },
    computeStatistic({ electricity }) {
      return electricity * MTOE_TO_TWH;
    },
  },
  PRIMARY_POWER_STATIONS_INPUT_MTOE: {
    sources: {
      geoth: '99',
      solarWindTide: '107',
      nuclear: '118',
      hydro: '115',
      bioWaste: '81',
      coal: '47',
      gas: '64',
      oil: '13',
      oilProducts: '25',
    },
    computeStatistic(sources) {
      return (
        sources.geoth +
        sources.solarWindTide +
        sources.nuclear +
        sources.hydro +
        sources.bioWaste +
        sources.coal +
        sources.gas +
        sources.oil +
        sources.oilProducts
      );
    },
  },
  PRIMARY_ENERGY_PRODUCTION_MTOE: {
    sources: {
      coal: '37',
      gas: '53',
      oil: '1',
      nuclear: '118',
      hydro: '115',
      bio: '70',
      geoth: '98',
      windSolarTide: '106',
    },
    computeStatistic(inputs) {
      return values(inputs).reduce((s, v) => s + v, 0);
    },
  },
};

function getBalanceStat(balanceData, code) {
  const stat = balanceData[code];
  return stat ? stat.values : ZEROS;
}

function computeValues(balanceData, statisticConfig) {
  const { sources: sourceMap, computeStatistic: compute } = statisticConfig;
  const sourceZeros = map(() => 0, sourceMap);

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
    .map(year => mergeAll([sourceZeros, ...allValuesByYear[year]]))
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

module.exports = { computeStatistic, computeValues };
