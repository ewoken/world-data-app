import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sortBy } from 'ramda';

import buildChart from '../../../HOC/buildChart';
import EnergyMixChart from '../components/EnergyMixChart';

import { fuelConsumedCountrySelector } from '../../../store/countries';

class EnergyMixChartWithState extends Component {
  constructor() {
    super();
    this.state = {
      displayedStats: [],
    };
    this.toggleStat = this.toggleStat.bind(this);
    this.setDisplayedStats = this.setDisplayedStats.bind(this);
    this.initDone = false;
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { countryCode, data } = this.props;
    if (
      newProps.countryCode !== countryCode ||
      (data.length !== newProps.data.length && !this.initDone)
    ) {
      this.init(newProps);
    }
  }

  setDisplayedStats(displayedStats) {
    this.setState({
      displayedStats,
    });
  }

  init({ data, fuelConsumed }) {
    this.initDone = true;
    this.setState({
      displayedStats: sortBy(
        fuel => -Math.max(...data.map(d => d[fuel])),
        Object.keys(fuelConsumed).filter(fuel => fuelConsumed[fuel]),
      ).concat(['reference']),
    });
  }

  toggleStat(toggledStat) {
    const { displayedStats } = this.state;
    this.setState({
      displayedStats: displayedStats.includes(toggledStat)
        ? displayedStats.filter(d => d !== toggledStat)
        : [...displayedStats, toggledStat],
    });
  }

  render() {
    return (
      <EnergyMixChart
        {...this.props}
        {...this.state}
        toggleStat={this.toggleStat}
        setDisplayedStats={this.setDisplayedStats}
      />
    );
  }
}

const EnergyMixChartBuilded = buildChart({
  perCapitaSwitch: true,
  stackedSwitch: true,
})(EnergyMixChartWithState);

const EnergyMixChartContainer = connect((state, { countryCode }) => ({
  fuelConsumed: fuelConsumedCountrySelector(countryCode, state),
}))(EnergyMixChartBuilded);

export default EnergyMixChartContainer;
