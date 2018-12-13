import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';

import HomeView from '../views/HomeView';
import CountryView from '../views/CountryView';

import HeaderMenu from './HeaderMenu';

import { CountriesLoader, StatisticsLoader } from '../loaders';

import { countriesLoadedSelector, countriesSelector } from '../store/countries';
import { statisticsLoadedSelector } from '../store/statistics';

const ConnectedHeaderMenu = withRouter(
  connect((state, props) => ({
    countries: countriesSelector(state),
    goTo: url => props.history.push(url),
  }))(HeaderMenu),
);

function AppLayout(props) {
  const { isReady } = props;
  return (
    <div className="AppLayout">
      <CountriesLoader />
      <StatisticsLoader />
      {!isReady && <Spin size="large" />}
      {isReady && (
        <Layout>
          <Layout.Header
            style={{ position: 'fixed', zIndex: 10, width: '100%' }}
          >
            <ConnectedHeaderMenu />
          </Layout.Header>
          <Layout.Content>
            <Switch>
              <Route path="/home" exact component={HomeView} />
              <Route
                path="/country/:countryCode"
                exact
                component={CountryView}
              />
              <Route
                component={() => <Redirect to={{ pathname: '/home' }} />}
              />
            </Switch>
          </Layout.Content>
          <Layout.Footer>Sources: IEA & EIA, World Data Bank</Layout.Footer>
        </Layout>
      )}
    </div>
  );
}

AppLayout.propTypes = {
  isReady: PropTypes.bool.isRequired,
};

// withRouter needed to prevent blocking
export default withRouter(
  connect(state => ({
    isReady: countriesLoadedSelector(state) && statisticsLoadedSelector(state),
  }))(AppLayout),
);
