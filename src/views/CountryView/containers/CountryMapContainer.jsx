import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CountryMap from '../components/CountryMap';

class CountryMapContainer extends Component {
  constructor() {
    super();
    this.state = { geojson: null };
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    const { country } = this.props;

    if (prevProps.country.alpha2Code !== country.alpha2Code) {
      this.fetch();
    }
  }

  fetch() {
    const { country } = this.props;
    fetch(`/geo/${country.alpha3Code}.geo.json`)
      .then(res => res.json())
      .then(geojson => this.setState({ geojson }));
  }

  render() {
    const { country } = this.props;
    const { geojson } = this.state;

    return <CountryMap country={country} countryGeoJSON={geojson} />;
  }
}

CountryMapContainer.propTypes = {
  country: PropTypes.shape({
    alpha2Code: PropTypes.string.isRequired,
    alpha3Code: PropTypes.string.isRequired,
  }).isRequired,
};

export default CountryMapContainer;
