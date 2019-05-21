import { values, indexBy, prop, mapObjIndexed } from 'ramda';
import { feature, merge } from 'topojson-client';
import L from 'leaflet';

import getAllCountries from '../api/countries';

export const COUNTRIES_LOAD_ACTION = 'COUNTRIES_LOAD_ACTION';
export const COUNTRIES_RECEIVE_ACTION = 'COUNTRIES_RECEIVE_ACTION';

const defaultIndicators = {
  // for areas
  coal: true,
  oil: true,
  gas: true,
  hydro: true,
  nuclear: true,
  biofuelsWaste: true,
  solarWindTideGeoth: true,
};

function loadCountriesAction() {
  return { type: COUNTRIES_LOAD_ACTION };
}

function receiveCountriesAction({ data, worldTopo, errors }) {
  return { type: COUNTRIES_RECEIVE_ACTION, data, worldTopo, errors };
}

export function loadAllCountries() {
  return function dispatchLoadAllCountries(dispatch) {
    dispatch(loadCountriesAction());
    return getAllCountries()
      .then(data =>
        dispatch(
          receiveCountriesAction({
            data: indexBy(prop('alpha2Code'), data.countries),
            worldTopo: data.worldTopo,
          }),
        ),
      )
      .catch(errors => dispatch(receiveCountriesAction({ errors })));
  };
}

const initialState = {
  loading: false,
  loaded: false,
  errors: null,
  data: {},
  worldTopo: null,
};

function countriesReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case COUNTRIES_LOAD_ACTION:
      return { ...state, loading: true };
    case COUNTRIES_RECEIVE_ACTION:
      return {
        ...state,
        loading: false,
        loaded: !action.errors,
        errors: action.errors || null,
        data: action.data || {},
        worldTopo: action.worldTopo,
      };
    default:
      return state;
  }
}

export function countriesLoadedSelector(state) {
  return state.countries.loaded;
}

export function worldTopoSelector(state) {
  return state.countries.worldTopo;
}

function addGeoJSONandBounds(country, worldTopo) {
  let geojson;
  if (country.countries) {
    const countryAlpha3Codes = country.countries.map(c => c.numericCode);
    const geometries = worldTopo.objects.countries.geometries.filter(c =>
      countryAlpha3Codes.includes(c.id),
    );
    geojson = merge(worldTopo, geometries);
  } else {
    const a = worldTopo.objects.countries.geometries.find(
      c => c.id === country.numericCode,
    );
    geojson = a && feature(worldTopo, a);
  }

  const bounds = geojson && L.geoJSON(geojson).getBounds();
  return {
    ...country,
    geojson,
    bounds,
  };
}

export function countrySelector(countryCode, state) {
  const initialCountry =
    state.countries.data[countryCode] || state.areas.data[countryCode];
  const memberCountryCodes =
    initialCountry.countries || initialCountry.countryCodes;

  const countryWithCountries = memberCountryCodes
    ? {
        ...initialCountry,
        countries: memberCountryCodes.map(code => countrySelector(code, state)),
      }
    : initialCountry;

  return addGeoJSONandBounds(countryWithCountries, worldTopoSelector(state));
}

export function countriesSelector(state) {
  return Object.keys(state.countries.data)
    .map(code => countrySelector(code, state))
    .filter(country => country.isIndependent);
}

export function countriesInBounds(boundsFilter, state) {
  const countries = countriesSelector(state);

  return boundsFilter
    ? countries.filter(
        country => country.bounds && boundsFilter.intersects(country.bounds),
      )
    : countries;
}

export function dependentCountriesSelector(state) {
  return values(state.countries.data).filter(c => !c.isIndependent);
}

export function fuelConsumedCountrySelector(countryCode, state) {
  const country = countrySelector(countryCode, state);
  return country ? country.hasConsumed : defaultIndicators;
}

export function fuelProducedCountrySelector(countryCode, state) {
  const country = countrySelector(countryCode, state);
  return country ? country.hasProduced : defaultIndicators;
}

export function fuelProducedOrConsumedCountrySelector(countryCode, state) {
  const country = countrySelector(countryCode, state);
  return country
    ? mapObjIndexed((v, k) => v || country.hasConsumed[k], country.hasProduced)
    : defaultIndicators;
}

export default countriesReducer;
