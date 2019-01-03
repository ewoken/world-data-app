import { feature } from 'topojson-client';

function countryMapValues(country, worldTopo) {
  const a = worldTopo.objects.countries.geometries.find(
    c => c.id === country.numericCode,
  );
  return {
    ...country,
    geojson: a && feature(worldTopo, a),
  };
}

async function getAllCountries() {
  const [countries, worldTopo] = await Promise.all(
    [fetch('/data/countries.json'), fetch('/data/worldTopo.json')].map(p =>
      p.then(res => res.json()),
    ),
  );
  return countries.map(country => countryMapValues(country, worldTopo));
}

export default getAllCountries;
