import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StatisticType } from '../../../utils/types';
import { tickFormatter } from '../../../utils';
import CustomTooltip from './CustomTooltip';

function ProdConsoChart(props) {
  const { fuel, statistics, data, height } = props;

  const consoStatistic = statistics.conso;
  const prodStatistic = statistics.prod;
  if (consoStatistic.unit.main !== prodStatistic.unit.main) {
    // eslint-disable-next-line no-console
    console.warn('Production and consommation have not the same unit', [
      prodStatistic.code,
      consoStatistic.code,
    ]);
  }
  const unit = consoStatistic.unit.main;
  const dataWithImportAndExport = data.map(l => {
    const diff = Number((l.prod - l.conso).toFixed(2));
    return {
      year: l.year,
      prod: l.prod,
      conso: l.conso,
      export: diff > 0 ? diff : null,
      import: diff < 0 ? -diff : null,
      base: Math.min(l.prod, l.conso),
    };
  });

  return (
    <div className="ProdConsoChart">
      <ResponsiveContainer height={height}>
        <ComposedChart data={dataWithImportAndExport}>
          <Area
            type="monotone"
            dot={false}
            dataKey="base"
            stroke="none"
            stackId="1"
            activeDot={false}
            fill="none"
            unit={unit}
          />
          <Area
            type="monotone"
            dot={false}
            unit={unit}
            name={`${fuel} export`}
            dataKey="export"
            activeDot={false}
            stroke="green"
            strokeOpacity={0}
            fillOpacity={0.8}
            fill="green"
            stackId="1"
          />
          <Area
            type="monotone"
            dot={false}
            unit={unit}
            name={`${fuel} import`}
            dataKey="import"
            activeDot={false}
            stroke="red"
            strokeOpacity={0}
            fillOpacity={0.8}
            fill="red"
            stackId="1"
          />
          <Line
            type="monotone"
            dataKey="conso"
            dot={false}
            unit={unit}
            stroke="#96281b"
            strokeWidth={3}
            name={consoStatistic.name}
          />
          <Line
            type="monotone"
            dataKey="prod"
            dot={false}
            unit={unit}
            stroke="black"
            strokeWidth={3}
            strokeOpacity={0.7}
            name={prodStatistic.name}
          />

          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            tickFormatter={tickFormatter}
            content={props2 => (
              <CustomTooltip
                {...props2}
                displayFilter={p => p.name !== 'base'}
              />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

ProdConsoChart.propTypes = {
  statistics: PropTypes.shape({
    prod: StatisticType.isRequired,
    conso: StatisticType.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      prod: PropTypes.number,
      conso: PropTypes.number,
    }),
  ).isRequired,
  fuel: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
};

export default ProdConsoChart;
