import L from 'leaflet';

// eslint-disable-next-line import/prefer-default-export
export function coordsToLatLng(coords) {
  const [longitude, latitude] = coords;

  if (longitude < -168.51) {
    return L.latLng(latitude, 360 + longitude);
  }
  return L.latLng(latitude, longitude).wrap();
}

// function bindEvent(countries, onCountryClick) {
//   return function onEachFeature(feature, layer) {
//     const country = countries.find(c => c.numericCode === feature.id);
//     layer.on({
//       click: () => onCountryClick(country),
//     });
//   };
// }
