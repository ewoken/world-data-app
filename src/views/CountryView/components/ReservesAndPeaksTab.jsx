import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import { ReferenceLine } from 'recharts';

import { FuelIndicatorsType } from '../../../utils/types';

import BasicChartContainer from '../containers/BasicChartContainer';

function PeakReference(props) {
  const { peak } = props;

  return (
    peak && (
      <ReferenceLine
        y={peak.value}
        stroke="red"
        strokeDasharray="3 3"
        isFront
      />
    )
  );
}

function PeakText(props) {
  const { fuel, peak } = props;
  return (
    peak && (
      <div style={{ textAlign: 'right' }}>
        {`Peak ${fuel} ${peak.before && peak.sure ? 'before' : 'in'} ${
          peak.year
          // eslint-disable-next-line no-nested-ternary
        }${peak.sure ? '' : peak.before ? ' (may be before)' : ' ?'}`}
      </div>
    )
  );
}

function ReservesAndPeaksTab(props) {
  const { countryCode, referenceCountryCode, fuelProduced, peaks } = props;
  return (
    <div className="ReservesAndPeaksTab">
      <Row gutter={20}>
        <h2>Productions</h2>
        {fuelProduced.coal && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="COAL_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
              peak={peaks.coal}
              extra={PeakReference}
            />
            <PeakText fuel="coal" peak={peaks.coal} />
          </Col>
        )}
        {fuelProduced.oil && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="OIL_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
              peak={peaks.oil}
              extra={PeakReference}
            />
            <PeakText fuel="oil" peak={peaks.oil} />
          </Col>
        )}
        {fuelProduced.gas && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="GAS_PRODUCTION_MTOE"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
              peak={peaks.gas}
              extra={PeakReference}
            />
            <PeakText fuel="gas" peak={peaks.gas} />
          </Col>
        )}
      </Row>
      <Row gutter={20}>
        <h2>Reserves</h2>
        {fuelProduced.coal && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="COAL_RESERVES_GT"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.oil && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="OIL_RESERVES_BB"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
        {fuelProduced.gas && (
          <Col md={8} sm={24}>
            <BasicChartContainer
              statisticCode="GAS_RESERVES_BCM"
              countryCode={countryCode}
              referenceCountryCode={referenceCountryCode}
            />
          </Col>
        )}
      </Row>
    </div>
  );
}

const PeakData = {
  year: PropTypes.number,
  value: PropTypes.number,
  sure: PropTypes.bool,
  before: PropTypes.bool,
};

ReservesAndPeaksTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
  fuelProduced: FuelIndicatorsType.isRequired,
  peaks: PropTypes.shape({
    coal: PeakData,
    oil: PeakData,
    gas: PeakData,
  }).isRequired,
};

export default ReservesAndPeaksTab;
