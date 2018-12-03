import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Map, TileLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';

class CustomGeoJSON extends Component {
  componentDidMount() {
    this.createGeoJSON();
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.geojson.remove();
      this.createGeoJSON();
    }
  }

  createGeoJSON() {
    const {
      leaflet: { map },
      data,
    } = this.props;

    this.geojson = L.geoJSON(data).addTo(map);
    const bounds = this.geojson.getBounds();
    map.fitBounds(bounds);
  }

  render() {
    return null;
  }
}
CustomGeoJSON.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  leaflet: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};
const GeoJSON = withLeaflet(CustomGeoJSON);

function CountryMap(props) {
  const { country, countryGeoJSON } = props;

  return (
    <div className="CountryMap">
      <Map
        center={country.latlng}
        zoom={2}
        style={{ height: '300px', zIndex: 0 }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countryGeoJSON && <GeoJSON data={countryGeoJSON} />}
      </Map>
    </div>
  );
}

CountryMap.propTypes = {
  country: PropTypes.shape({
    latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
    area: PropTypes.number.isRequired,
  }).isRequired,
  countryGeoJSON: PropTypes.shape().isRequired,
};

export default CountryMap;
