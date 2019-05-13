import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'qs';

import { Row, Col } from 'antd';
import ScrollToTop from '../../components/ScrollToTop';

import WorldMap from './components/WorldMap';
import StatisticExplorer from './components/StatisticExplorer';
import HDIByEnergyChartContainer from './containers/HDIByEnergyChartContainer';

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
    statistics: allStatisticsSelector(state).filter(s => !s.isGlobal),
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
      scale: null,
      boundsFilter: null,
    };
    this.mapRef = React.createRef();
    this.onMapChange = e =>
      this.setFilterBounds(e.target.getBounds(), e.target.getZoom());
  }

  componentDidMount() {
    const { loadStatistic, statisticCode, perCapita } = this.props;

    loadStatistic(statisticCode);

    if (perCapita) {
      loadStatistic('POPULATION');
    }
  }

  componentDidUpdate(prevProps) {
    const { loadStatistic, statisticCode, perCapita } = this.props;
    if (statisticCode !== prevProps.statisticCode) {
      loadStatistic(statisticCode);
    }
    if (perCapita !== prevProps.perCapita && perCapita) {
      loadStatistic('POPULATION');
    }
  }

  setParameters(parameters) {
    const { statisticCode, perCapita, currentYear, goTo } = this.props;
    const newPerCapita =
      parameters.perCapita === undefined ? perCapita : parameters.perCapita;

    const newParameters = {
      statisticCode,
      currentYear,
      ...parameters,
      perCapita: newPerCapita && parameters.statisticCode !== 'POPULATION',
    };
    goTo(`?${qs.stringify(newParameters)}`);
  }

  setFilterBounds(bounds, zoom) {
    this.setState({ boundsFilter: zoom === MIN_ZOOM ? null : bounds });
  }

  setScale(scale) {
    this.setState({ scale });
  }

  render() {
    const {
      goTo,
      currentYear,
      statisticCode,
      perCapita,
      location,
    } = this.props;
    const { scale, boundsFilter } = this.state;

    return (
      <div className="HomeView">
        <ScrollToTop />
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
              onRowClick={record => goTo(`country/${record.countryCode}`)}
              setYear={year => this.setParameters({ currentYear: year })}
              setStatistic={value =>
                this.setParameters({ statisticCode: value })
              }
              setPerCapita={value => this.setParameters({ perCapita: value })}
              mapRef={this.mapRef}
              scale={scale}
              setScale={value => this.setScale(value)}
              boundsFilter={boundsFilter}
            />
          </Col>
          {location.search.includes('beta') && (
            <Col md={24} style={{ marginTop: 20, backgroundColor: 'white' }}>
              <HDIByEnergyChartContainer
                title="Human development index according to energy in 2016"
                description="size of circle depends on population"
                height={600}
              />
            </Col>
          )}
        </Row>
      </div>
    );
  }
}

HomeView.propTypes = {
  loadStatistic: PropTypes.func.isRequired,
  statisticCode: PropTypes.string,
  perCapita: PropTypes.bool.isRequired,
  currentYear: PropTypes.number.isRequired,
  goTo: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
};

HomeView.defaultProps = {
  statisticCode: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
};

export default connect(
  (state, props) => {
    const { search } = props.location;
    const queryObject = search ? qs.parse(search.substr(1)) : {};
    return {
      goTo(path) {
        props.history.push(path);
      },
      currentYear: Number(queryObject.currentYear) || 2010,
      perCapita: queryObject.perCapita === 'true',
      statisticCode: queryObject.statisticCode,
    };
  },
  { loadStatistic: loadStatisticOfCountries },
)(HomeView);
