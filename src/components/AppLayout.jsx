import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Route, // as BaseRoute,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import { Layout, Spin } from 'antd';

import HomeView from '../views/HomeView';
import CountryView from '../views/CountryView';
import AboutView from '../views/AboutView';
import AreaView from '../views/AreaView';

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
import {
  loadAllAreas,
  areasLoadedSelector,
  areasSelector,
} from '../store/areas';
import { LocationType } from '../utils/types';

const CountriesLoader = buildLoader(loadAllCountries);
const StatisticsLoader = buildLoader(loadAllStatistics);
const AreasLoader = buildLoader(loadAllAreas);

const ConnectedHeaderMenu = withRouter(
  connect((state, props) => ({
    countries: countriesSelector(state),
    areas: areasSelector(state),
    goTo: url => props.history.push(url),
  }))(HeaderMenu),
);

function scrollToAnchor(location) {
  const { hash } = location;

  if (hash !== '') {
    const id = hash.substr(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }
}

class AppLayout extends Component {
  componentDidMount() {
    const { location } = this.props;
    window.onhashchange = () => scrollToAnchor(location);
  }

  componentDidUpdate() {
    const { location } = this.props;
    scrollToAnchor(location);
  }

  render() {
    const { isLoaded } = this.props;
    return (
      <div className="AppLayout">
        <CountriesLoader />
        <StatisticsLoader />
        <AreasLoader />
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
                    path="/country/:countryCode/:tab?"
                    exact
                    component={CountryView}
                  />
                  <Route
                    path="/area/:areaCode/:tab?"
                    exact
                    component={AreaView}
                  />
                  <Route path="/about" exact component={AboutView} />
                  <Route
                    component={() => <Redirect to={{ pathname: '/home' }} />}
                  />
                </Switch>
              )}
            </Layout.Content>
            <Layout.Footer>Sources: IEA, World Bank</Layout.Footer>
          </Layout>
        </Spin>
      </div>
    );
  }
}

AppLayout.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  location: LocationType.isRequired,
};

// withRouter needed to prevent blocking
export default withRouter(
  connect(state => ({
    isLoaded:
      countriesLoadedSelector(state) &&
      statisticsLoadedSelector(state) &&
      areasLoadedSelector(state),
  }))(AppLayout),
);
