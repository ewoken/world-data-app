import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';

import HomeView from '../views/HomeView';
import CountryView from '../views/CountryView';
import AboutView from '../views/AboutView';

import HeaderMenu from './HeaderMenu';

import buildLoader from '../HOC/buildLoader';

import {
  loadAllCountries,
  countriesLoadedSelector,
  countriesSelector,
} from '../store/countries';
import {
  loadAllStatistics,
  statisticsLoadedSelector,
} from '../store/statistics';

const CountriesLoader = buildLoader(loadAllCountries);
const StatisticsLoader = buildLoader(loadAllStatistics);

const ConnectedHeaderMenu = withRouter(
  connect((state, props) => ({
    countries: countriesSelector(state),
    goTo: url => props.history.push(url),
  }))(HeaderMenu),
);

function AppLayout(props) {
  const { isLoaded } = props;
  return (
    <div className="AppLayout">
      <CountriesLoader />
      <StatisticsLoader />
      <Spin size="large" spinning={!isLoaded}>
        <Layout>
          <Layout.Header
            style={{ position: 'fixed', zIndex: 10, width: '100%' }}
          >
            <ConnectedHeaderMenu />
          </Layout.Header>
          <Layout.Content>
            {!isLoaded && <div className="AppLayout__splash" />}
            {isLoaded && (
              <Switch>
                <Route path="/home" exact component={HomeView} />
                <Route
                  path="/country/:countryCode"
                  exact
                  component={CountryView}
                />
                <Route path="/about" exact component={AboutView} />
                <Route
                  component={() => <Redirect to={{ pathname: '/home' }} />}
                />
              </Switch>
            )}
          </Layout.Content>
          <Layout.Footer>Sources: IEA, World Data Bank</Layout.Footer>
        </Layout>
      </Spin>
    </div>
  );
}

AppLayout.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
};

// withRouter needed to prevent blocking
export default withRouter(
  connect(state => ({
    isLoaded: countriesLoadedSelector(state) && statisticsLoadedSelector(state),
  }))(AppLayout),
);
