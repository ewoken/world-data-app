import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { values, map } from 'ramda';

import { Spin } from 'antd';
import EnergyMixChart from '../components/EnergyMixChart';

import {
  loadCountryStatistics,
  countryStatisticsLoadedSelector,
  compiledCountryStatisticsSelector,
  energySourceCountryConsumedSelector,
  statisticSelector,
} from '../../../store/statistics';

const WORLD = 'WORLD';
const POPULATION = 'POPULATION';

const ConnectedEnergyMixChart = connect(
  (state, { countryCode, perCapita, mapOfStatistics, worldReference }) => ({
    data: compiledCountryStatisticsSelector(
      {
        mapOfCountryStatistics: {
          ...mapOfStatistics,
          world: {
            statisticCode: worldReference,
            countryCode: WORLD,
          },
        },
        countryCode,
        perCapita,
      },
      state,
    ),
    statistics: map(
      statisticCode => statisticSelector(statisticCode, state),
      mapOfStatistics,
    ),
    sourceConsumed: energySourceCountryConsumedSelector(countryCode, state),
  }),
)(EnergyMixChart);

class EnergyMixChartContainer extends Component {
  constructor() {
    super();

    this.state = {
      stacked: true,
      perCapita: false,
    };
  }

  componentDidMount() {
    const {
      countryCode,
      loadStatistics,
      mapOfStatistics,
      worldReference,
    } = this.props;
    const statisticCodes = values(mapOfStatistics).concat([POPULATION]);

    loadStatistics({ statisticCodes, countryCode });
    loadStatistics({
      statisticCodes: [worldReference, POPULATION],
      countryCode: WORLD,
    });
  }

  componentDidUpdate(prevProps) {
    const { countryCode, loadStatistics, mapOfStatistics } = this.props;
    if (countryCode !== prevProps.countryCode) {
      const statisticCodes = values(mapOfStatistics);
      loadStatistics({ statisticCodes, countryCode });
    }
  }

  setStacked(stacked) {
    this.setState({ stacked });
  }

  setPerCapita(perCapita) {
    this.setState({ perCapita });
  }

  render() {
    const {
      title,
      isLoaded,
      countryCode,
      mapOfStatistics,
      worldReference,
    } = this.props;
    const { stacked, perCapita } = this.state;

    return (
      <Spin spinning={!isLoaded}>
        <ConnectedEnergyMixChart
          title={title}
          countryCode={countryCode}
          mapOfStatistics={mapOfStatistics}
          worldReference={worldReference}
          setStacked={value => this.setStacked(value)}
          setPerCapita={value => this.setPerCapita(value)}
          stacked={stacked}
          perCapita={perCapita}
        />
      </Spin>
    );
  }
}

EnergyMixChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  loadStatistics: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  mapOfStatistics: PropTypes.shape({
    coal: PropTypes.string.isRequired,
    oil: PropTypes.string.isRequired,
    gas: PropTypes.string.isRequired,
    hydro: PropTypes.string.isRequired,
    nuclear: PropTypes.string.isRequired,
    biofuelsWaste: PropTypes.string.isRequired,
    solarWindTideGeoth: PropTypes.string.isRequired,
  }).isRequired,
  worldReference: PropTypes.string.isRequired,
};

export default connect(
  (state, props) => ({
    isLoaded:
      countryStatisticsLoadedSelector(
        {
          statisticCodes: values(props.mapOfStatistics).concat([POPULATION]),
          countryCode: props.countryCode,
        },
        state,
      ) &&
      countryStatisticsLoadedSelector(
        {
          statisticCodes: [props.worldReference, POPULATION],
          countryCode: WORLD,
        },
        state,
      ),
  }),
  { loadStatistics: loadCountryStatistics },
)(EnergyMixChartContainer);
