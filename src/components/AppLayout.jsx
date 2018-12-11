import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortBy, prop } from 'ramda';

import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Spin, Select } from 'antd';

import HomeView from '../views/HomeView';
import ChartView from '../views/ChartView';
import CountryView from '../views/CountryView';

import { CountriesLoader, StatisticsLoader } from '../loaders';

import { countriesLoadedSelector, countriesSelector } from '../store/countries';
import { statisticsLoadedSelector } from '../store/statistics';

function AppLayout(props) {
  const { isReady, countries, history } = props;
  return (
    <div className="AppLayout">
      <CountriesLoader />
      <StatisticsLoader />
      {!isReady && <Spin size="large" />}
      {isReady && (
        <Layout>
          <Layout.Header
            style={{ position: 'fixed', zIndex: 10, width: '100%' }} // TODO
          >
            <Menu
              mode="horizontal"
              theme="dark"
              selectable={false}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="home">
                <Link to="/home">
                  <strong>Home</strong>
                </Link>
              </Menu.Item>
              {/* <Menu.Item key="chart">
                <Link to="/chart">
                  <strong>Chart</strong>
                </Link>
              </Menu.Item> */}
              <Menu.Item>
                <Select
                  style={{ width: '20vw' }}
                  placeholder="Countries"
                  optionFilterProp="title"
                  showSearch
                  onSelect={value => {
                    history.push(`/country/${value}`);
                  }}
                >
                  {sortBy(prop('commonName'), countries).map(country => (
                    <Select.Option
                      key={country.alpha2Code}
                      disabled={country.disabled}
                      title={`${country.commonName} (${country.alpha3Code})`}
                    >
                      {`${country.commonName}${
                        country.disabled ? ' (No data)' : ''
                      }`}
                    </Select.Option>
                  ))}
                </Select>
              </Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout.Content
            style={{
              padding: '20px 50px 0 50px',
              marginTop: 64,
            }}
          >
            <Switch>
              <Route path="/home" exact component={HomeView} />
              {/* <Route path="/chart" exact component={ChartView} /> */}
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
          <Layout.Footer>Sources: IEA & EIA</Layout.Footer>
        </Layout>
      )}
    </div>
  );
}

AppLayout.propTypes = {
  isReady: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      alpha2Code: PropTypes.string.isRequired,
      commonName: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

// withRouter needed to prevent blocking
export default withRouter(
  connect(state => ({
    isReady: countriesLoadedSelector(state) && statisticsLoadedSelector(state),
    countries: countriesSelector(state),
  }))(AppLayout),
);
