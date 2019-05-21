import { merge } from 'topojson-client';

import {
  countrySelector,
  countriesSelector,
  worldTopoSelector,
} from './countries';
import { areaSelector, areasOfCountrySelector, areasSelector } from './areas';

export function countryWithAreasSelector(countryCode, state) {
  const country = countrySelector(countryCode, state);
  const areas = areasOfCountrySelector(countryCode, state);

  return {
    ...country,
    areas,
  };
}

export function areaWithCountriesSelector(areaCode, state) {
  const area = areaSelector(areaCode, state);
  const worldTopo = worldTopoSelector(state);

  const countries = area.countryCodes
    ? area.countryCodes
        .map(countryCode => countrySelector(countryCode, state))
        .filter(c => !!c)
    : countriesSelector(state);

  const countryAlpha3Codes = countries.map(c => c.numericCode);
  const geometries = worldTopo.objects.countries.geometries.filter(c =>
    countryAlpha3Codes.includes(c.id),
  );

  return {
    ...area,
    countries,
    geojson: merge(worldTopo, geometries),
  };
}

export function countriesAndAreasSelector(state) {
  return [
    ...countriesSelector(state).filter(c => !c.disabled),
    ...areasSelector(state),
  ];
}
