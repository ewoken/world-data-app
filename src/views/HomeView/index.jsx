import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import WorldMap from './components/WorldMap';
import StatisticExplorer from './components/StatisticExplorer';

import {
  countriesSelector,
  countriesInBounds,
  dependentCountriesSelector,
} from '../../store/countries';
import {
  allStatisticsSelector,
  statisticSelector,
  compiledStatisticForCountriesAndYear,
  loadStatisticOfCountries,
  statisticOfAllCountriesLoadedSelector,
  statisticSourcesSelector,
} from '../../store/statistics';

function f(statisticCode, perCapita) {
  // TODO
  return perCapita ? [statisticCode, 'POPULATION'] : [statisticCode];
}

const ConnectedWorldMap = connect(
  (state, { statisticCode, currentYear, perCapita, boundsFilter }) => ({
    selectedCountries: countriesInBounds(boundsFilter, state),
    countries: countriesSelector(state),
    dependentCountries: dependentCountriesSelector(state),
    currentStatistic: statisticSelector(statisticCode, state),
    data: compiledStatisticForCountriesAndYear(
      {
        statisticCode,
        year: currentYear,
        perCapita,
      },
      state,
    ),
  }),
)(WorldMap);

const ConnectedStatisticExplorer = connect(
  (state, { statisticCode, currentYear, perCapita, boundsFilter }) => ({
    countries: countriesInBounds(boundsFilter, state),
    statistics: allStatisticsSelector(state),
    currentStatistic: statisticSelector(statisticCode, state),
    statisticSources: statisticSourcesSelector(
      f(statisticCode, perCapita),
      state,
    ),
    isLoaded:
      statisticOfAllCountriesLoadedSelector(statisticCode, state) &&
      (!perCapita ||
        statisticOfAllCountriesLoadedSelector('POPULATION', state)),
    data: compiledStatisticForCountriesAndYear(
      {
        statisticCode,
        year: currentYear,
        perCapita,
      },
      state,
    ),
  }),
)(StatisticExplorer);

const MIN_ZOOM = 2;

class HomeView extends Component {
  constructor() {
    super();
    this.state = {
      statisticCode: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
      currentYear: 2010,
      perCapita: false,
      scale: null,
      boundsFilter: null,
    };
    this.mapRef = React.createRef();
    this.onMapChange = e =>
      this.setFilterBounds(e.target.getBounds(), e.target.getZoom());
  }

  componentDidMount() {
    const { statisticCode } = this.state;
    const { loadStatistic } = this.props;

    loadStatistic(statisticCode);
  }

  setStatistic(statisticCode) {
    const { loadStatistic } = this.props;
    loadStatistic(statisticCode);
    const newState = {
      statisticCode,
      ...(statisticCode === 'POPULATION' ? { perCapita: false } : {}),
    };
    this.setState(newState);
  }

  setYear(year) {
    this.setState({ currentYear: year });
  }

  setFilterBounds(bounds, zoom) {
    this.setState({ boundsFilter: zoom === MIN_ZOOM ? null : bounds });
  }

  setPerCapita(value) {
    const { loadStatistic } = this.props;
    if (value) {
      loadStatistic('POPULATION');
    }
    this.setState({ perCapita: value });
  }

  setScale(scale) {
    this.setState({ scale });
  }

  render() {
    const {
      history: { push },
    } = this.props;
    const {
      currentYear,
      statisticCode,
      perCapita,
      scale,
      boundsFilter,
    } = this.state;

    return (
      <div className="HomeView">
        <Row>
          <h1>Welcome to the World Energy Data Explorer</h1>
        </Row>
        <Row gutter={{ md: 20 }}>
          <Col md={16}>
            <div ref={this.mapRef}>
              <ConnectedWorldMap
                statisticCode={statisticCode}
                currentYear={currentYear}
                perCapita={perCapita}
                scale={scale}
                minZoom={MIN_ZOOM}
                onMapChange={this.onMapChange}
                boundsFilter={boundsFilter}
              />
            </div>
          </Col>
          <Col md={8}>
            <ConnectedStatisticExplorer
              statisticCode={statisticCode}
              currentYear={currentYear}
              perCapita={perCapita}
              onRowClick={record => push(`country/${record.countryCode}`)}
              setYear={year => this.setYear(year)}
              setStatistic={value => this.setStatistic(value)}
              setPerCapita={value => this.setPerCapita(value)}
              mapRef={this.mapRef}
              scale={scale}
              setScale={value => this.setScale(value)}
              boundsFilter={boundsFilter}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

HomeView.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loadStatistic: PropTypes.func.isRequired,
};

export default connect(
  null,
  { loadStatistic: loadStatisticOfCountries },
)(HomeView);
