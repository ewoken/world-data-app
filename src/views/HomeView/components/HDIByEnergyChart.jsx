import React from 'react';
import PropTypes from 'prop-types';
import {
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Legend,
} from 'recharts';
import { toPairs, range } from 'ramda';
import regression from 'regression';

import CustomTooltip from '../../CountryView/components/CustomTooltip';

import { StatisticType, CountryType } from '../../../utils/types';
import { tickFormatter, displayUnit } from '../../../utils';

const RESOLUTION = 100;
const COLORS = {
  Africa: 'black',
  Europe: 'blue',
  Americas: 'red',
  Asia: 'green',
  Oceania: 'orange',
};
const legend = toPairs(COLORS).map(array => ({
  value: array[0],
  color: array[1],
}));

const DISPLAYED_COUNTRIES = [
  'CN',
  'US',
  'FR',
  'DE',
  'GB',
  'BR',
  'CA',
  'IN',
  'RU',
  'ZA',
];

function HDIByEnergyChart(props) {
  const { data, statistics, height, countries } = props;

  const finalData = data
    .filter(d => d.energy && d.hdi)
    .map(d => {
      const country = countries.find(c => c.alpha2Code === d.countryCode);
      return {
        ...d,
        r: Math.max(Math.log(d[`pop/${d.countryCode}`]) + 1, 2),
        commonName: country.commonName,
        color: COLORS[country.region],
        label: DISPLAYED_COUNTRIES.includes(d.countryCode) ? d.countryCode : '',
      };
    })
    .sort((a, b) => (a.r < b.r ? 1 : -1));
  const dataArray = finalData.map(d => [d.energy, d.hdi]);
  const { equation } = regression.logarithmic(dataArray);
  const min = Math.min(...finalData.map(d => d.energy));
  const max = Math.max(...finalData.map(d => d.energy));
  const data2 = range(0, RESOLUTION + 1)
    .map(i => {
      const energy = min + (i / RESOLUTION) * (max - min);
      return {
        energy,
        hdi: equation[1] * Math.log(energy) + equation[0],
      };
    })
    .filter(d => d.hdi < 1);

  return (
    <div className="HDIByEnergyChart">
      <ResponsiveContainer height={height}>
        <ScatterChart data={finalData} margin={{ bottom: 50 }}>
          <Scatter data={data2} line={{ stroke: 'grey' }} shape={() => null} />
          <Scatter
            shape={props2 => (
              <circle
                cx={props2.cx}
                cy={props2.cy}
                r={props2.r}
                fill={props2.color}
              />
            )}
          >
            <LabelList dataKey="label" position="top" />
          </Scatter>
          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis
            dataKey="energy"
            name={statistics.energy.name}
            type="number"
            tickFormatter={tickFormatter}
            label={{
              value: `${statistics.energy.name} (${displayUnit(
                statistics.energy.unit,
                true,
              )})`,
              position: 'bottom',
              style: { fill: '#666' },
            }}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis
            dataKey="hdi"
            name={statistics.hdi.name}
            tickFormatter={tickFormatter}
            padding={{ top: 5 }}
            domain={[0.2, 1]}
          />
          <Tooltip
            content={props2 => (
              <CustomTooltip
                {...props2}
                label={
                  props2.payload &&
                  props2.payload[0] &&
                  `${
                    countries.find(
                      c =>
                        c.alpha2Code === props2.payload[0].payload.countryCode,
                    ).commonName
                  } (${props2.payload[0].payload.countryCode})`
                }
                labelColor={
                  props2.payload &&
                  props2.payload[0] &&
                  props2.payload[0].payload.color
                }
                units={{
                  '0': `${displayUnit(statistics.energy.unit, true)}`,
                  '1': statistics.hdi.unit.main,
                }}
              />
            )}
          />
          <Legend verticalAlign="top" payload={legend} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

HDIByEnergyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      hdi: PropTypes.number,
      energy: PropTypes.number,
    }),
  ).isRequired,
  countries: PropTypes.arrayOf(CountryType.isRequired).isRequired,
  statistics: PropTypes.shape({
    hdi: StatisticType,
    energy: StatisticType,
  }).isRequired,
  color: PropTypes.string,
  height: PropTypes.number.isRequired,
};

HDIByEnergyChart.defaultProps = {
  color: '#2c82c9',
};

export default HDIByEnergyChart;
