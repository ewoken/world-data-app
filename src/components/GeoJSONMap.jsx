import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Map, TileLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';

import { coordsToLatLng } from '../utils';

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

    this.geojson = L.geoJSON(data, { coordsToLatLng }).addTo(map);
    const bounds = this.geojson.getBounds();
    map.flyToBounds(bounds);
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

function GeoJSONMap(props) {
  const { geojson, center } = props;

  return (
    <div className="GeoJSONMap">
      <Map
        center={center}
        zoom={2}
        zoomDelta={0}
        zoomSnap={0}
        boxZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        style={{ height: '300px', zIndex: 0 }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && <GeoJSON data={geojson} />}
      </Map>
    </div>
  );
}

GeoJSONMap.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geojson: PropTypes.object.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default GeoJSONMap;
