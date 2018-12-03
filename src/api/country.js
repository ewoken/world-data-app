const countriesData = require('world-countries/countries');

const noData = ['AD', 'LI', 'MH', 'FM', 'MC', 'PW', 'SM', 'TV', 'VA'];

const countries = countriesData
  .map(country => ({
    id: Number(country.ccn3),
    alpha2Code: country.cca2,
    commonName: country.name.common,
    alpha3Code: country.cca3,
    numericCode: country.ccn3,
    region: country.region,
    subregion: country.subregion,
    isIndependent: country.independent,
    area: country.area,
    capital: country.capital,
    latlng: country.latlng,
    disabled: noData.includes(country.cca2),
  }))
  .filter(c => c.region !== 'Antarctic')
  .filter(c => c.isIndependent);

function getAllCountries() {
  return Promise.resolve(countries);
}

export default getAllCountries;
