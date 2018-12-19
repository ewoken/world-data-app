const { range, mapObjIndexed, values, groupBy, mergeAll } = require('ramda');

const ZEROS = range(1973, 2017).map(year => ({ year, value: 0 }));
const NULLS = range(1973, 2017).map(year => ({ year, value: null }));

const statisticCodeMap = {
  NUCLEAR_CONSUMPTION_MTOE: '118',
  HYDRO_CONSUMPTION_MTOE: '115',
  NON_HYDRO_RENEWABLES_CONSUMPTION_MTOE: {
    sources: {
      biofuelsProd: '70',
      biofuelsImport: '71',
      biofuelsStockBuild: '72',
      biofuelsStockDraw: '73',
      biofuelsStatMinus: '74',
      biofuelsStatPlus: '75',
      biofuelsExport: '76',
      geothProd: '98',
      geothStatMinus: '100',
      geothStatPlus: '101',
      solarTideWindProd: '106',
      solarTideWindStatMinus: '108',
      solarTideWindStatPlus: '109',
    },
    computeStatistic(sources) {
      const minus = [
        'biofuelsStockBuild',
        'biofuelsStatMinus',
        'biofuelsExport',
        'geothStatMinus',
        'solarTideWindStatMinus',
      ];
      const valuesToAdd = mapObjIndexed(
        (value, sourceName) => (minus.includes(sourceName) ? -value : value),
        sources,
      );
      const d = values(valuesToAdd).reduce((sum, value) => sum + value, 0);
      return Math.round(d * 10) / 10;
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
