const ieaAPI = require('./iea');
const worldBankAPI = require('./worldBank');
const eiaAPI = require('./eia');
const ieaSankey = require('./ieaSankey');
const hdroApi = require('./hdro');
const bp = require('./bp');

const sources = {
  [ieaAPI.id]: ieaAPI,
  [worldBankAPI.id]: worldBankAPI,
  [eiaAPI.id]: eiaAPI,
  [ieaSankey.id]: ieaSankey,
  [hdroApi.id]: hdroApi,
  [bp.id]: bp,
};

module.exports = sources;
