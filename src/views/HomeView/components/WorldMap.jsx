import React from 'react';
import PropTypes from 'prop-types';
import { indexBy, map } from 'ramda';
import { interpolateRgb } from 'd3-interpolate';

import { Map, Tooltip, GeoJSON } from 'react-leaflet';

import { CountryType, StatisticType } from '../../../utils/types';
import {
  coordsToLatLng,
  isMobileOrTablet,
  formatNumber,
  displayUnit,
} from '../../../utils';

const MAP_HEIGHT = '540px';
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
      return { color: NA_COLOR, value };
    }
    if (value === 0) {
      return { color: MIN_COLOR, value };
    }
    return {
      color: gradiant(func(value / minValue) / func(maxValue / minValue)),
      value,
    };
  }, valueMap);
  return colorMap;
}

function WorldMap(props) {
  const {
    countries,
    dependentCountries,
    data,
    currentStatistic,
    currentYear,
    perCapita,
  } = props;
  const maxValue = Math.max(
    ...data.filter(d => d.countryCode !== 'WORLD').map(d => d.value),
  );
  const colorValueMap = computeColorMap(data);
  return (
    <div className="WorldMap">
      <div className="WorldMap__yearLabel">{currentYear}</div>
      <Map
        zoom={1}
        center={[0, 0]}
        style={{ height: MAP_HEIGHT, zIndex: 0 }}
        maxBounds={[[90, -180], [-90, 180]]}
        dragging={!isMobileOrTablet()}
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
                  color: 'white',
                  weight: 0.5,
                  fillColor: color,
                  fillOpacity: 1,
                })
              }
            >
              <Tooltip sticky>
                {`${country.commonName}: ${formatNumber(value)}`}
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
              color: 'white',
              weight: 0.5,
              fillColor: NA_COLOR,
            }}
          />
        ))}
      </Map>
      <div className="WorldMap__legend">
        <div>
          <div>
            {`${currentStatistic.name} (${displayUnit(
              currentStatistic.unit,
              perCapita,
            )})`}
          </div>
          <div className="WorldMap__legend__colors">
            <div>
              <div
                className="WorldMap__legend__gradient"
                style={{
                  background: colorGradient,
                }}
              />
              <div className="WorldMap__legend__gradientRange">
                <div>0</div>
                <div>{formatNumber(maxValue)}</div>
              </div>
            </div>
            <div>
              <div
                className="WorldMap__legend__NA__square"
                style={{ backgroundColor: NA_COLOR }}
              />
              <div>NA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

WorldMap.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  dependentCountries: PropTypes.arrayOf(CountryType).isRequired,
  currentStatistic: StatisticType.isRequired,
  currentYear: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      value: PropTypes.number,
    }).isRequired,
  ).isRequired,
  perCapita: PropTypes.bool.isRequired,
};

export default WorldMap;
