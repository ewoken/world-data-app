import React from 'react';
import PropTypes from 'prop-types';
import { indexBy, map } from 'ramda';
import { interpolateRgb } from 'd3-interpolate';

import { Map, Tooltip, GeoJSON } from 'react-leaflet';

import { getDependentCountries } from '../../../api/country';
import { CountryType, StatisticType } from '../../../utils/types';
import { coordsToLatLng } from '../../../utils';

const dependentCountries = getDependentCountries();

const MAP_HEIGHT = '500px';
const MIN_COLOR = 'rgb(107, 185, 240)';
const MAX_COLOR = '#001529';
const NA_COLOR = '#777';
const colorGradient = `linear-gradient(to right, ${MIN_COLOR}, ${MAX_COLOR})`;
const gradiant = interpolateRgb(MIN_COLOR, MAX_COLOR);
const func = i => Math.log(i);

function computeColorMap(data) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.filter(d => d.value).map(d => d.value));
  const valueMap = map(d => d.value, indexBy(d => d.countryCode, data));

  const colorMap = map(value => {
    if (value === null || value === undefined) {
      return { color: NA_COLOR, value: 'NA' };
    }
    return {
      color: gradiant(func(value / minValue) / func(maxValue / minValue)),
      value,
    };
  }, valueMap);
  return colorMap;
}

function WorldMap(props) {
  const { countries, data, currentStatistic, currentYear } = props;
  const maxValue = Math.max(...data.map(d => d.value));
  const colorValueMap = computeColorMap(data);
  return (
    <div className="WorldMap">
      <div className="WorldMap__yearLabel">{currentYear}</div>
      <Map
        zoom={1}
        center={[0, 0]}
        style={{ height: MAP_HEIGHT, zIndex: 0 }}
        maxBounds={[[90, -180], [-90, 180]]}
      >
        {countries.map(country => {
          const { value, color } = colorValueMap[country.alpha2Code];
          return (
            <GeoJSON
              key={country.alpha2Code + currentStatistic.code}
              data={country.geojson}
              coordsToLatLng={coordsToLatLng}
              ref={ref =>
                ref &&
                ref.leafletElement.setStyle({
                  color,
                  fillColor: color,
                  fillOpacity: 1,
                })
              }
            >
              <Tooltip sticky>
                {`${country.commonName}: ${value.toLocaleString()}`}
              </Tooltip>
            </GeoJSON>
          );
        })}
        {dependentCountries.map(country => (
          <GeoJSON
            key={country.alpha2Code}
            data={country.geojson}
            style={{
              fillOpacity: 1,
              stroke: false,
              fillColor: NA_COLOR,
              color: NA_COLOR,
            }}
          />
        ))}
      </Map>
      <div className="WorldMap__legend">
        <div className="WorldMap__legend__gradient">
          <div>{`${currentStatistic.name} (${currentStatistic.unit})`}</div>
          <div
            className="WorldMap__legend__gradientColor"
            style={{
              background: colorGradient,
            }}
          />
          <div className="WorldMap__legend__gradientRange">
            <div>0</div>
            <div>{maxValue.toLocaleString()}</div>
          </div>
        </div>
        <div>
          <div>{' '}</div>
          <div
            className="WorldMap__legend__NA__square"
            style={{ backgroundColor: NA_COLOR }}
          />
          <div>NA</div>
        </div>
      </div>
    </div>
  );
}

WorldMap.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  currentStatistic: StatisticType.isRequired,
  currentYear: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      value: PropTypes.number,
    }).isRequired,
  ).isRequired,
};

export default WorldMap;
