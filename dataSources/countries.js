const countriesData = require('world-countries/countries');

const noDataCountries = require('./noDataCountries.json');

function countryMapValues(country) {
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
    capital: country.capital[0], // TODO
    latlng: country.latlng,
    disabled: noDataCountries.includes(country.cca2),
  };
}
const countries = countriesData.map(countryMapValues);

module.exports = {
  countries,
  independentCountries: countries.filter(c => c.isIndependent),
  dependentCountries: countries.filter(c => !c.isIndependent),
};
