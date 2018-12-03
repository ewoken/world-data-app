import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class HomeView extends Component {
  constructor() {
    super();

    this.state = {};
  }

  setCountry(countryCode) {
    this.setState(state => ({
      ...state,
      countryCode,
    }));
  }

  setStatistic(statisticCode) {
    this.setState(state => ({
      ...state,
      statisticCode,
    }));
  }

  render() {
    return <div className="HomeView" />;
  }
}

HomeView.propTypes = {};

export default HomeView;
