import React from 'react';
import PropTypes from 'prop-types';

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
import { values } from 'ramda';

import { getNiceTickValues } from 'recharts-scale';
import { tickFormatter, displayUnit } from '../../../utils';
import { StatisticType } from '../../../utils/types';
import CustomTooltip from './CustomTooltip';

function EnergyMixChart(props) {
  const { data, stacked, perCapita, fuelConsumed, statistics } = props;
  const { unit: coalUnit } = statistics.coal;
  const unit = displayUnit(coalUnit, perCapita);
  const LineArea = stacked ? Area : Line;
  const defaultLineAreaProps = {
    type: 'monotone',
    dot: false,
    activeDot: false,
    unit,
  };

  const lineAreaProps = stacked
    ? { stackId: '1', ...defaultLineAreaProps }
    : { strokeWidth: 2, ...defaultLineAreaProps };

  if (
    values(statistics).some(statistic => statistic.unit.main !== coalUnit.main)
  ) {
    console.warn('EnergyMixChart : statistics have not same units');
  }

  const max = Math.max(
    ...(stacked
      ? data.map(d =>
          Object.keys(fuelConsumed).reduce((sum, k) => sum + d[k], 0),
        )
      : data.map(d => Math.max(...Object.keys(fuelConsumed).map(k => d[k])))),
    ...(perCapita ? data.map(d => d.world) : []),
  );

  const chartMax = max * 1.05;
  const ticks = getNiceTickValues([0, chartMax], 5, true);

  if (ticks[3] > chartMax) {
    ticks.pop();
  }
  const domain = [0, ticks[ticks.length - 1]];

  return (
    <div className="EnergyMixChart">
      <ResponsiveContainer height={280} width="100%">
        <ComposedChart data={data}>
          {fuelConsumed.coal && (
            <LineArea
              {...lineAreaProps}
              dataKey="coal"
              name="Coal"
              stroke="black"
              fill="black"
            />
          )}
          {fuelConsumed.oil && (
            <LineArea
              {...lineAreaProps}
              dataKey="oil"
              name="Oil"
              stroke="grey"
              fill="grey"
            />
          )}
          {fuelConsumed.gas && (
            <LineArea
              {...lineAreaProps}
              dataKey="gas"
              name="Gas"
              stroke="orange"
              fill="orange"
            />
          )}
          {fuelConsumed.nuclear && (
            <LineArea
              {...lineAreaProps}
              dataKey="nuclear"
              name="Nuclear"
              stroke="purple"
              fill="purple"
            />
          )}
          {fuelConsumed.hydro && (
            <LineArea
              {...lineAreaProps}
              dataKey="hydro"
              name="Hydroelectricity"
              stroke="blue"
              fill="blue"
            />
          )}
          {fuelConsumed.biofuelsWaste && (
            <LineArea
              {...lineAreaProps}
              dataKey="biofuelsWaste"
              name="Biofuels & Waste"
              stroke="saddlebrown"
              fill="saddlebrown"
            />
          )}
          {fuelConsumed.solarWindTideGeoth && (
            <LineArea
              {...lineAreaProps}
              dataKey="solarWindTideGeoth"
              name="Geothermy, Wind, Solar & Tide"
              stroke="green"
              fill="green"
            />
          )}
          {perCapita && (
            <Line
              type="monotone"
              dataKey="world"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              name="World"
              stroke="red"
              unit={unit}
            />
          )}

          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" interval={4} />
          <YAxis tickFormatter={tickFormatter} ticks={ticks} domain={domain} />
          <Tooltip
            content={props2 => (
              <CustomTooltip
                {...props2}
                withTotal
                totalFilter={p => p.name !== 'World'}
              />
            )}
          />
          <Legend iconType="circle" />
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
};

export default EnergyMixChart;
