const {
  IEA_API,
  fetchStatisticFromIEA,
  getConfigObject: getIeaConfig,
} = require('./iea');
const {
  WORLD_BANK_API,
  fetchStatisticFromWorldBank,
  getConfigObject: getWorldBankConfig,
} = require('./worldBank');
const {
  EIA_API,
  fetchStatisticFromEIA,
  getConfigObject: getEiaConfig,
} = require('./eia');

function fetchStatisticFromSource(statistic) {
  switch (statistic.source) {
    case EIA_API:
      return fetchStatisticFromEIA(statistic);
    case IEA_API:
      return fetchStatisticFromIEA(statistic);
    case WORLD_BANK_API:
      return fetchStatisticFromWorldBank(statistic);
    default:
      throw new Error('Unknown source');
  }
}

function getApiConfig() {
  return {
    eiaConfig: getEiaConfig(),
    ieaConfig: getIeaConfig(),
    worldBankConfig: getWorldBankConfig(),
  };
}

module.exports = {
  fetchStatisticFromSource,
  getApiConfig,
};
