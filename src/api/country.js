import { feature } from 'topojson-client';
import countriesData from 'world-countries/countries';
import worldTopo from 'world-atlas/world/110m.json';

const noData = ['AD', 'LI', 'MH', 'FM', 'MC', 'PW', 'SM', 'TV', 'VA'];

function countryMapValues(country) {
  const a = worldTopo.objects.countries.geometries.find(
    c => c.id === country.ccn3,
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
    capital: country.capital[0], // TODO
    latlng: country.latlng,
    disabled: noData.includes(country.cca2),
    geojson: a && feature(worldTopo, a),
  };
}

export function getDependentCountries() {
  return countriesData.filter(c => !c.independent).map(countryMapValues);
}

function getAllCountries() {
  return Promise.resolve(
    countriesData.filter(c => c.independent).map(countryMapValues),
  );
}

// getAllCountries().then(data => console.log(data.filter(c => !c.geojson)));

export default getAllCountries;
