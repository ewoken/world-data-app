import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import WorldMap from './components/WorldMap';
import StatisticExplorer from './components/StatisticExplorer';

import { countriesSelector } from '../../store/countries';
import {
  allStatisticsSelector,
  statisticSelector,
  compiledStatisticForCountriesAndYear,
  loadStatisticOfCountries,
} from '../../store/statistics';

const ConnectedWorldMap = connect(
  (state, { statisticCode, currentYear, perCapita }) => ({
    countries: countriesSelector(state),
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
  (state, { statisticCode, currentYear, perCapita }) => ({
    countries: countriesSelector(state),
    statistics: allStatisticsSelector(state),
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
)(StatisticExplorer);

class HomeView extends Component {
  constructor() {
    super();
    this.state = {
      statisticCode: 'PRIMARY_ENERGY_MTOE',
      currentYear: 2010,
      perCapita: false,
    };
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

  setPerCapita(value) {
    const { loadStatistic } = this.props;
    if (value) {
      loadStatistic('POPULATION');
    }
    this.setState({ perCapita: value });
  }

  render() {
    const {
      history: { push },
    } = this.props;
    const { currentYear, statisticCode, perCapita } = this.state;

    return (
      <div className="HomeView">
        <Row gutter={{ md: 20 }}>
          <Col md={16}>
            <ConnectedWorldMap
              statisticCode={statisticCode}
              currentYear={currentYear}
              perCapita={perCapita}
            />
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
