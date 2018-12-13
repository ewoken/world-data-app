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

const ConnectedWorldMap = connect((state, { statisticCode, currentYear }) => ({
  countries: countriesSelector(state),
  currentStatistic: statisticSelector(statisticCode, state),
  data: compiledStatisticForCountriesAndYear(
    {
      statisticCode,
      year: currentYear,
    },
    state,
  ),
}))(WorldMap);

const ConnectedStatisticExplorer = connect(
  (state, { statisticCode, currentYear }) => ({
    countries: countriesSelector(state),
    statistics: allStatisticsSelector(state),
    currentStatistic: statisticSelector(statisticCode, state),
    data: compiledStatisticForCountriesAndYear(
      {
        statisticCode,
        year: currentYear,
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
    this.setState({ statisticCode });
  }

  setYear(year) {
    this.setState({ currentYear: year });
  }

  render() {
    const {
      history: { push },
    } = this.props;
    const { currentYear, statisticCode } = this.state;

    return (
      <div className="HomeView">
        <Row gutter={{ md: 20 }}>
          <Col md={16}>
            <ConnectedWorldMap
              statisticCode={statisticCode}
              currentYear={currentYear}
            />
          </Col>
          <Col md={8}>
            <ConnectedStatisticExplorer
              statisticCode={statisticCode}
              currentYear={currentYear}
              onRowClick={record => push(`country/${record.countryCode}`)}
              setYear={year => this.setYear(year)}
              setStatistic={value => this.setStatistic(value)}
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
