const countriesData = require('world-countries/countries');

const formerCountries = require('./formerCountries');

function countryMapValues(country) {
  const formerCountry = formerCountries.find(c =>
    c.countries.includes(country.cca2),
  );

  return {
    id: Number(country.ccn3),
    alpha2Code: country.cca2,
    commonName: country.name.common,
    alpha3Code: country.cca3,
    numericCode: country.ccn3,
    region: country.region,
    subregion: country.subregion,
    isIndependent: country.independent,
    area: country.area,
    capital: country.capital[0] || 'No official capital',
    latlng: country.latlng,
    flagIcon: country.flag,
    former: false,
    firstYear: formerCountry ? formerCountry.lastYear + 1 : 0,
    lastYear: country.lastYear || 3000,
  };
}
const countries = countriesData
  .map(countryMapValues)
  .concat(formerCountries.map(c => ({ ...c, former: true })));

module.exports = {
  countries,
  independentCountries: countries.filter(c => c.isIndependent),
  dependentCountries: countries.filter(c => !c.isIndependent),
};
