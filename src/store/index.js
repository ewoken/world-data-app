import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import countriesReducer from './countries';
import statisticsReducer from './statistics';
import areasReducer from './areas';

const rootReducer = combineReducers({
  // ...reducers,
  countries: countriesReducer,
  statistics: statisticsReducer,
  areas: areasReducer,
});

const enhancers = [applyMiddleware(thunk)];
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const enhancer = composeEnhancers(...enhancers);

const store = createStore(rootReducer, enhancer);

export default store;
