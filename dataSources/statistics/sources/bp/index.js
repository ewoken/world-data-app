const fs = require('fs');
const path = require('path');

function fetchCountryStatisticFromBP(statisticCode) {
  if (statisticCode === 'OIL_PRICE_USD') {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, './oil_price_usd.json')),
    );
  }
  throw new Error();
}

module.exports = {
  id: 'bp',
  fetchCountryStatistic: fetchCountryStatisticFromBP,
  attribution: 'BP',
  url:
    'https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy/downloads.html',
};
