import { values, indexBy, prop } from 'ramda';

import getAllAreas from '../api/areas';

export const AREAS_LOAD_ACTION = 'AREAS_LOAD_ACTION';
export const AREAS_RECEIVE_ACTION = 'AREAS_RECEIVE_ACTION';

function loadAreasAction() {
  return { type: AREAS_LOAD_ACTION };
}

function receiveAreasAction({ data, errors }) {
  return { type: AREAS_RECEIVE_ACTION, data, errors };
}

export function loadAllAreas() {
  return function dispatchLoadAllAreas(dispatch) {
    dispatch(loadAreasAction());
    return getAllAreas()
      .then(data =>
        dispatch(
          receiveAreasAction({
            data: indexBy(prop('code'), data),
          }),
        ),
      )
      .catch(errors => dispatch(receiveAreasAction({ errors })));
  };
}

const initialState = {
  loading: false,
  loaded: false,
  errors: null,
  data: {},
};

function areasReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case AREAS_LOAD_ACTION:
      return { ...state, loading: true };
    case AREAS_RECEIVE_ACTION:
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

export function areasLoadedSelector(state) {
  return state.areas.loaded;
}

export function areasSelector(state) {
  return values(state.areas.data);
}

export function areaSelector(areaCode, state) {
  return state.areas.data[areaCode];
}

export function areasOfCountrySelector(countryCode, state) {
  return values(state.areas.data).filter(
    area => area.countryCodes && area.countryCodes.includes(countryCode),
  );
}

export default areasReducer;
