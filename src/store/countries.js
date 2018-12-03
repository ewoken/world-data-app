import { values, indexBy, prop } from 'ramda';

import getAllCountries from '../api/country';

export const COUNTRIES_LOAD_ACTION = 'COUNTRIES_LOAD_ACTION';
export const COUNTRIES_RECEIVE_ACTION = 'COUNTRIES_RECEIVE_ACTION';

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
  return values(state.countries.data);
}

export function countrySelector(countryCode, state) {
  return state.countries.data[countryCode];
}

export default countriesReducer;
