import React from 'react';
import PropTypes from 'prop-types';
import { values, mapObjIndexed } from 'ramda';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import color from 'onecolor';

import { getNiceTickValues } from 'recharts-scale';
import { tickFormatter, displayUnit, clickHandlers } from '../../../utils';
import { StatisticType, CountryType } from '../../../utils/types';
import CustomTooltip from './CustomTooltip';

const FILL_OPACITY = 0.7;
const REFERENCE_DATAKEY = 'reference'; // TODO in selectors
const defaultLineAreaProps = {
  type: 'monotone',
  dot: false,
  activeDot: false,
  fillOpacity: FILL_OPACITY,
  isAnimationActive: false,
};

const lineAreaPropsMap = {
  coal: { name: 'Coal', color: 'black' },
  oil: { name: 'Oil', color: 'grey' },
  gas: { name: 'Gas', color: 'orange' },
  nuclear: { name: 'Nuclear', color: 'purple' },
  hydro: { name: 'Hydroelectricity', color: 'blue' },
  biofuelsWaste: { name: 'Biofuels & Waste', color: 'saddlebrown' },
  solarWindTideGeoth: { name: 'Geothermy, Wind, Solar & Tide', color: 'green' },
};

const legendPayload = values(
  mapObjIndexed((p, key) => ({ ...p, dataKey: key }), lineAreaPropsMap),
).map(props => ({
  dataKey: props.dataKey,
  value: props.name,
  type: 'circle',
  inactive: false,
  color: color(props.color)
    .alpha(FILL_OPACITY)
    .cssa(),
}));

function getLegendPayload({
  fuelConsumed,
  displayedStats,
  perCapita,
  referenceCountry,
}) {
  return legendPayload
    .filter(payload => fuelConsumed[payload.dataKey])
    .map(payload => ({
      ...payload,
      inactive: !displayedStats.includes(payload.dataKey),
    }))
    .concat(
      perCapita
        ? [
            {
              dataKey: REFERENCE_DATAKEY,
              value: referenceCountry.commonName,
              color: 'red',
              type: 'circle',
              inactive: !displayedStats.includes(REFERENCE_DATAKEY),
            },
          ]
        : [],
    );
}

function getTicksAndDomain({ data, perCapita, displayedStats, stacked }) {
  const displayedFuels = displayedStats.filter(s => s !== REFERENCE_DATAKEY);
  const withReference = perCapita && displayedStats.includes(REFERENCE_DATAKEY);
  const max = Math.max(
    ...(stacked
      ? data.map(d => displayedFuels.reduce((sum, k) => sum + d[k], 0))
      : data.map(d => Math.max(...displayedFuels.map(k => d[k])))),
    ...(withReference ? data.map(d => d.reference) : []),
  );

  const chartMax = max * 1.05;
  const ticks = getNiceTickValues([0, chartMax], 5, true);

  if (ticks[3] > chartMax) {
    ticks.pop();
  }
  const domain = [0, ticks[ticks.length - 1]];
  return { domain, ticks };
}

function EnergyMixChart(props) {
  const {
    data,
    stacked,
    perCapita,
    fuelConsumed,
    statistics,
    referenceCountry,
    displayedStats,
    toggleStat,
    setDisplayedStats,
  } = props;
  const { unit: coalUnit } = statistics.coal;
  const unit = displayUnit(coalUnit, perCapita);
  const LineArea = stacked ? Area : Line;
  const lineAreaProps = stacked
    ? { stackId: '1', unit, ...defaultLineAreaProps }
    : { strokeWidth: 2, unit, ...defaultLineAreaProps };

  if (
    values(statistics).some(statistic => statistic.unit.main !== coalUnit.main)
  ) {
    console.warn('EnergyMixChart : statistics have not same units');
  }

  return (
    <div className="EnergyMixChart">
      <ResponsiveContainer height={280} width="100%">
        <ComposedChart data={data}>
          {displayedStats
            .filter(s => s !== REFERENCE_DATAKEY)
            .map(fuel => {
              const fuelProps = lineAreaPropsMap[fuel];
              return (
                <LineArea
                  key={fuel}
                  {...lineAreaProps}
                  dataKey={fuel}
                  name={fuelProps.name}
                  stroke={fuelProps.color}
                  fill={fuelProps.color}
                />
              );
            })}
          {perCapita && displayedStats.includes(REFERENCE_DATAKEY) && (
            <Line
              type="monotone"
              dataKey="reference"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              name={referenceCountry.commonName}
              stroke="red"
              unit={unit}
              isAnimationActive={false}
            />
          )}

          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" interval={4} />
          <YAxis
            tickFormatter={tickFormatter}
            {...getTicksAndDomain({
              data,
              perCapita,
              displayedStats,
              stacked,
            })}
          />
          <Tooltip
            content={props2 => (
              <CustomTooltip
                {...props2}
                withTotal
                totalFilter={p => p.dataKey !== REFERENCE_DATAKEY}
              />
            )}
          />
          <Legend
            iconType="circle"
            onClick={clickHandlers({
              onClick: ({ dataKey }) => toggleStat(dataKey),
              onDoubleClick: ({ dataKey }) => setDisplayedStats([dataKey]),
            })}
            payload={getLegendPayload({
              fuelConsumed,
              displayedStats,
              perCapita,
              referenceCountry,
            })}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

EnergyMixChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      coal: PropTypes.number,
      oil: PropTypes.number,
      gas: PropTypes.number,
      hydro: PropTypes.number,
      nuclear: PropTypes.number,
      biofuelsWaste: PropTypes.number,
      solarWindTideGeoth: PropTypes.number,
      world: PropTypes.number,
    }).isRequired,
  ).isRequired,
  fuelConsumed: PropTypes.shape({
    coal: PropTypes.bool,
    oil: PropTypes.bool,
    gas: PropTypes.bool,
    hydro: PropTypes.bool,
    nuclear: PropTypes.bool,
    biofuelsWaste: PropTypes.bool,
    solarWindTideGeoth: PropTypes.bool,
  }).isRequired,
  statistics: PropTypes.shape({
    coal: StatisticType.isRequired,
    oil: StatisticType.isRequired,
    gas: StatisticType.isRequired,
    hydro: StatisticType.isRequired,
    nuclear: StatisticType.isRequired,
    biofuelsWaste: StatisticType.isRequired,
    solarWindTideGeoth: StatisticType.isRequired,
  }).isRequired,
  setStacked: PropTypes.func.isRequired,
  setPerCapita: PropTypes.func.isRequired,
  stacked: PropTypes.bool.isRequired,
  perCapita: PropTypes.bool.isRequired,
  referenceCountry: CountryType.isRequired,
  toggleStat: PropTypes.func.isRequired,
  setDisplayedStats: PropTypes.func.isRequired,
  displayedStats: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default EnergyMixChart;
