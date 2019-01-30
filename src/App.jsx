import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import store from './store';

import AppLayout from './components/AppLayout';
import AnalyticsComponent from './components/AnalyticsComponent';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <AnalyticsComponent>
            <AppLayout />
          </AnalyticsComponent>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
