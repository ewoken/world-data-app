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
import { Radio } from 'antd';

function CustomTooltip(props) {
  const { active, payload } = props;

  if (active && payload && payload.length > 0) {
    const { label } = props;
    const { unit } = payload[0];
    const payloadWithoutWorld = payload
      ? payload.filter(p => p.dataKey !== 'worldPrimary')
      : [];
    const worldPrimary = payload
      ? payload.find(p => p.dataKey === 'worldPrimary')
      : [];
    const total = payloadWithoutWorld.reduce(
      (sum, { value }) => sum + value,
      0,
    );

    return (
      <div className="CustomTooltip">
        <div>{label}</div>
        <div>
          {payloadWithoutWorld.map(p => (
            <div key={p.dataKey} style={{ lineHeight: '22px', color: p.color }}>
              {`${p.name} : ${p.value.toLocaleString()} ${p.unit}`}
            </div>
          ))}
          <hr size={1} />
          <div key="total" style={{ lineHeight: '22px', color: 'black' }}>
            {`Total : ${Number(total.toFixed(2)).toLocaleString()} ${unit}`}
          </div>
          {worldPrimary && (
            <div
              key="primaryWorld"
              style={{ lineHeight: '22px', color: 'red' }}
            >
              {`World : ${Number(
                worldPrimary.value.toFixed(2),
              ).toLocaleString()} ${unit}`}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  label: PropTypes.string,
};
CustomTooltip.defaultProps = {
  label: '',
};

function PrimaryEnergyChart(props) {
  const { data, stacked, setStacked, perCapita, setPerCapita } = props;
  const unit = perCapita ? ' toe/capita' : ' Mtoe';

  const dataWithTotal = data.map(v => ({
    ...v,
    total: Number(
      (v.coal + v.oil + v.gas + v.hydro + v.nuclear + v.renewables).toFixed(2),
    ),
  }));

  // TODO
  const hasCoal = data.some(v => v.coal >= 0.01);
  const hasOil = data.some(v => v.oil >= 0.01);
  const hasGas = data.some(v => v.gas >= 0.01);
  const hasNuclear = data.some(v => v.nuclear >= 0.01);
  const hasHydro = data.some(v => v.hydro >= 0.01);
  const hasRenewables = data.some(v => v.renewables >= 0.01);

  const LineArea = stacked ? Area : Line;

  return (
    <div className="PrimaryEnergyChart">
      <h3 className="PrimaryEnergyChart__title">Primary Energy Consumption</h3>
      <div>
        <Radio.Group
          buttonStyle="solid"
          size="small"
          value={stacked}
          onChange={e => setStacked(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <Radio.Button value>Stacked</Radio.Button>
          <Radio.Button value={false}>Split</Radio.Button>
        </Radio.Group>
        <Radio.Group
          buttonStyle="solid"
          size="small"
          value={perCapita}
          onChange={e => setPerCapita(e.target.value)}
        >
          <Radio.Button value={false}>Absolute</Radio.Button>
          <Radio.Button value>Per capita</Radio.Button>
        </Radio.Group>
      </div>
      <ResponsiveContainer height={300} width="100%">
        <ComposedChart
          data={dataWithTotal}
          margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
        >
          {hasCoal && (
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
          {hasOil && (
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
          {hasGas && (
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
          {hasNuclear && (
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
          {hasHydro && (
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
          {hasRenewables && (
            <LineArea
              type="monotone"
              dataKey="renewables"
              dot={false}
              activeDot={false}
              name="Other renewables"
              stroke="green"
              fill="green"
              stackId="1"
              unit={unit}
            />
          )}
          {perCapita && (
            <Line
              type="monotone"
              dataKey="worldPrimary"
              dot={false}
              activeDot={false}
              name="World"
              stroke="red"
              unit={unit}
            />
          )}

          <CartesianGrid stroke="#ccc" opacity={0.2} />
          <XAxis dataKey="year" interval={4} />
          <YAxis
            label={{
              value: unit,
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip content={CustomTooltip} />
          <Legend iconType="circle" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

PrimaryEnergyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      coal: PropTypes.number,
      oil: PropTypes.number,
      gas: PropTypes.number,
      hydro: PropTypes.number,
      nuclear: PropTypes.number,
      renewables: PropTypes.number,
      worldPrimary: PropTypes.number,
      total: PropTypes.number,
    }).isRequired,
  ).isRequired,
  setStacked: PropTypes.func.isRequired,
  setPerCapita: PropTypes.func.isRequired,
  stacked: PropTypes.bool.isRequired,
  perCapita: PropTypes.bool.isRequired,
};

export default PrimaryEnergyChart;
