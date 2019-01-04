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

import { tickFormatter, displayUnit } from '../../../utils';
import { StatisticType } from '../../../utils/types';
import CustomTooltip from './CustomTooltip';

function EnergyMixChart(props) {
  const { data, stacked, perCapita, sourceConsumed, statistics } = props;
  const { unit: coalUnit } = statistics.coal;
  const unit = displayUnit(coalUnit, perCapita);
  const LineArea = stacked ? Area : Line;

  if (
    values(statistics).some(statistic => statistic.unit.main !== coalUnit.main)
  ) {
    console.warn('EnergyMixChart : statistics have not same units');
  }

  return (
    <div className="EnergyMixChart">
      <ResponsiveContainer height={280} width="100%">
        <ComposedChart data={data}>
          {sourceConsumed.coal && (
            <LineArea
              type="monotone"
              dataKey="coal"
              dot={false}
              activeDot={false}
              name="Coal"
              stroke="black"
              fill="black"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.oil && (
            <LineArea
              type="monotone"
              dataKey="oil"
              dot={false}
              activeDot={false}
              name="Oil"
              stroke="grey"
              fill="grey"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.gas && (
            <LineArea
              type="monotone"
              dataKey="gas"
              dot={false}
              activeDot={false}
              name="Gas"
              stroke="orange"
              fill="orange"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.nuclear && (
            <LineArea
              type="monotone"
              dataKey="nuclear"
              dot={false}
              activeDot={false}
              name="Nuclear"
              stroke="purple"
              fill="purple"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.hydro && (
            <LineArea
              type="monotone"
              dataKey="hydro"
              dot={false}
              activeDot={false}
              name="Hydroelectricity"
              stroke="blue"
              fill="blue"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.biofuelsWaste && (
            <LineArea
              type="monotone"
              dataKey="biofuelsWaste"
              dot={false}
              activeDot={false}
              name="Biofuels & Waste"
              stroke="saddlebrown"
              fill="saddlebrown"
              stackId="1"
              unit={unit}
            />
          )}
          {sourceConsumed.solarWindTideGeoth && (
            <LineArea
              type="monotone"
              dataKey="solarWindTideGeoth"
              dot={false}
              activeDot={false}
              name="Geothermy, Wind, Solar & Tide"
              stroke="green"
              fill="green"
              stackId="1"
              unit={unit}
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
          <YAxis tickFormatter={tickFormatter} />
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
  sourceConsumed: PropTypes.shape({
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
