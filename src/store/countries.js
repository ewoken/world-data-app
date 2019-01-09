import { values, indexBy, prop, mapObjIndexed } from 'ramda';

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

function receiveCountriesAction({ data, errors }) {
  return { type: COUNTRIES_RECEIVE_ACTION, data, errors };
}

export function loadAllCountries() {
  return function dispatchLoadAllCountries(dispatch) {
    dispatch(loadCountriesAction());
    return getAllCountries()
      .then(data =>
        dispatch(
          receiveCountriesAction({
            data: indexBy(prop('alpha2Code'), data),
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
      };
    default:
      return state;
  }
}

export function countriesLoadedSelector(state) {
  return state.countries.loaded;
}

export function countriesSelector(state) {
  return values(state.countries.data).filter(c => c.isIndependent);
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

export function countrySelector(countryCode, state) {
  return state.countries.data[countryCode];
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
