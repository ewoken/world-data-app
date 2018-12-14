import { countrySelector, countriesSelector } from './countries';
import { areaSelector, areasOfCountrySelector } from './areas';

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
  const countries = area.countryCodes
    ? area.countryCodes
        .map(countryCode => countrySelector(countryCode, state))
        .filter(c => !!c)
    : countriesSelector(state);
  return {
    ...area,
    countries,
  };
}
