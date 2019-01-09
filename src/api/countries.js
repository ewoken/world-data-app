import { feature } from 'topojson-client';
import L from 'leaflet';

function countryMapValues(country, worldTopo) {
  const a = worldTopo.objects.countries.geometries.find(
    c => c.id === country.numericCode,
  );
  const geojson = a && feature(worldTopo, a);
  const bounds = a && L.geoJSON(geojson).getBounds();
  return {
    ...country,
    geojson,
    bounds,
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
