import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';

import withCountryStatistics from '../../../HOC/withCountryStatistics';
import ProdConsoChart from './ProdConsoChart';

const ProdConsoChartContainer = withCountryStatistics((state, props) => ({
  prod: props.prodStatisticCode,
  conso: props.consoStatisticCode,
}))(ProdConsoChart);

function IndependencyTab(props) {
  const { countryCode } = props;
  return (
    <div className="IndependencyTab">
      <Row>
        <h3>Imports/Exports</h3>
        <Col md={8} sm={24}>
          <ProdConsoChartContainer
            countryCode={countryCode}
            prodStatisticCode="COAL_PRODUCTION_MTOE"
            consoStatisticCode="COAL_CONSUMPTION_MTOE"
            fuel="Coal"
          />
        </Col>
        <Col md={8} sm={24}>
          <ProdConsoChartContainer
            countryCode={countryCode}
            prodStatisticCode="OIL_PRODUCTION_MTOE"
            consoStatisticCode="OIL_CONSUMPTION_MTOE"
            fuel="Oil"
          />
        </Col>
        <Col md={8} sm={24}>
          <ProdConsoChartContainer
            countryCode={countryCode}
            prodStatisticCode="GAS_PRODUCTION_MTOE"
            consoStatisticCode="GAS_CONSUMPTION_MTOE"
            fuel="Gas"
          />
        </Col>
      </Row>
    </div>
  );
}

IndependencyTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default IndependencyTab;
