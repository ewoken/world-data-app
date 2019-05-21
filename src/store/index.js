import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { map, omit } from 'ramda';

import countriesReducer from './countries';
import statisticsReducer, {
  COUNTRY_STATISTIC_RECEIVE_ACTION,
  STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION,
} from './statistics';
import areasReducer from './areas';

function actionSanitizer(action) {
  if (
    (action.type === COUNTRY_STATISTIC_RECEIVE_ACTION ||
      action.type === STATISTIC_RECEIVE_ALL_COUNTRIES_ACTION) &&
    action.data
  ) {
    return { ...action, data: 'DATA' };
  }
  return action;
}

function stateSanitizer(state) {
  return {
    ...state,
    countries: omit(['worldTopo'], state.countries),
    statistics: map(
      statistic => ({
        ...statistic,
        values: map(
          country => ({
            ...country,
            values: country.values && `[${country.values.length}]`,
          }),
          statistic.values,
        ),
      }),
      state.statistics.data,
    ),
  };
}

const rootReducer = combineReducers({
  // ...reducers,
  countries: countriesReducer,
  statistics: statisticsReducer,
  areas: areasReducer,
});

const enhancers = [applyMiddleware(thunk)];
const composeEnhancers = composeWithDevTools({
  actionSanitizer,
  stateSanitizer,
});
const enhancer = composeEnhancers(...enhancers);

const store = createStore(rootReducer, enhancer);

export default store;
