import React from 'react';
import PropTypes from 'prop-types';
import { indexBy, map, range } from 'ramda';
import { scaleLog, scaleLinear } from 'd3-scale';
import * as d3Colors from 'd3-scale-chromatic';

import { Map, Tooltip, GeoJSON } from 'react-leaflet';

import { CountryType, StatisticType } from '../../../utils/types';
import {
  coordsToLatLng,
  isMobileOrTablet,
  formatNumber,
  displayUnit,
} from '../../../utils';

const MAP_HEIGHT = '540px';
const NA_COLOR = '#888';
const BORDER_COLOR = 'black';
const LEGEND_COLORS_COUNT = 4;
const LEGEND_WIDTH = 300; // px
const COLORS_SCHEME = 'YlGnBu';

const interpolator = d3Colors[`interpolate${COLORS_SCHEME}`];

function computeColorMap(data, scaleString) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.filter(d => d.value).map(d => d.value));
  const valueMap = map(d => d.value, indexBy(d => d.countryCode, data));
  const scaleType = scaleString === 'linear' ? scaleLinear() : scaleLog();
  const scale = scaleType.domain([minValue, maxValue]);

  const colorMap = map(value => {
    if (value === null || value === undefined) {
      return { color: NA_COLOR, value };
    }
    if (value === 0) {
      return { color: interpolator(0), value };
    }
    return {
      color: interpolator(scale(value)),
      value,
    };
  }, valueMap);
  return colorMap;
}

function WorldMap(props) {
  const {
    selectedCountries,
    countries,
    dependentCountries,
    data,
    currentStatistic,
    currentYear,
    perCapita,
    scale,
    minZoom,
    onMapChange,
  } = props;
  const selectedCountryByCode = indexBy(c => c.alpha2Code, selectedCountries);
  const selectedData = data.filter(
    d => d.countryCode !== 'WORLD' && selectedCountryByCode[d.countryCode],
  );
  const maxValue = Math.max(...selectedData.map(d => d.value));
  const colorValueMap = computeColorMap(
    selectedData,
    currentStatistic.scale || scale,
  );
  return (
    <div className="WorldMap">
      <div className="WorldMap__yearLabel">{currentYear}</div>
      <Map
        minZoom={minZoom}
        zoom={minZoom}
        zoomSnap={0.1}
        zoomDelta={0.5}
        center={[20, 30]}
        style={{ height: MAP_HEIGHT, zIndex: 0 }}
        dragging={!isMobileOrTablet()}
        onZoomend={onMapChange}
        onMoveend={onMapChange}
      >
        {countries.map(country => {
          const countryData = colorValueMap[country.alpha2Code];
          return (
            <GeoJSON
              key={country.alpha2Code + currentStatistic.code}
              data={country.geojson}
              coordsToLatLng={coordsToLatLng}
              ref={ref =>
                ref &&
                ref.leafletElement.setStyle({
                  color: BORDER_COLOR,
                  weight: 0.5,
                  fillColor: countryData ? countryData.color : NA_COLOR,
                  fillOpacity: 1,
                })
              }
            >
              <Tooltip sticky>
                {`${country.commonName}: ${formatNumber(
                  countryData && countryData.value,
                )}`}
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
              <div className="WorldMap__legend__gradient">
                {range(0, LEGEND_COLORS_COUNT).map(i => (
                  <div
                    key={i}
                    className="WorldMap__legend__gradient__item"
                    style={{
                      width: LEGEND_WIDTH / LEGEND_COLORS_COUNT,
                      background: `linear-gradient(to right, ${interpolator(
                        i / LEGEND_COLORS_COUNT,
                      )}, ${interpolator((i + 1) / LEGEND_COLORS_COUNT)}`,
                    }}
                  />
                ))}
              </div>
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
  selectedCountries: PropTypes.arrayOf(CountryType).isRequired,
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
  scale: PropTypes.string,
  minZoom: PropTypes.number,
  onMapChange: PropTypes.func.isRequired,
};

WorldMap.defaultProps = {
  scale: null,
  minZoom: 1.8,
};

export default WorldMap;
