import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/world/110m.json';

function countryMapValues(country) {
  const a = worldTopo.objects.countries.geometries.find(
    c => c.id === country.numericCode,
  );
  return {
    ...country,
    geojson: a && feature(worldTopo, a),
  };
}

async function getAllCountries() {
  const res = await fetch('/data/countries.json');
  const countries = await res.json();
  return countries.map(countryMapValues);
}

export default getAllCountries;
