const ieaAPI = require('./iea');
const worldBankAPI = require('./worldBank');
const eiaAPI = require('./eia');
const ieaSankey = require('./ieaSankey');

const sources = {
  [ieaAPI.id]: ieaAPI,
  [worldBankAPI.id]: worldBankAPI,
  [eiaAPI.id]: eiaAPI,
  [ieaSankey.id]: ieaSankey,
};

module.exports = sources;
