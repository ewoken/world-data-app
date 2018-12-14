import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { Row, Col } from 'antd';

import { countrySelector } from '../../store/countries';

import PrimaryEnergyChartContainer from './containers/PrimaryEnergyChartContainer';
import ProdConsoChartContainer from './containers/ProdConsoCharContainer';
import CountryMap from './components/CountryMap';

function CountryView(props) {
  const { country } = props;

  if (!country || country.disabled) {
    return <Redirect to="/" />;
  }

  const countryCode = country.alpha2Code;
  return (
    <div className="CountryView">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={18}>
          <h2>{country.commonName}</h2>
          <div>{`Capital: ${country.capital}`}</div>
          <div>{`Area: ${country.area.toLocaleString()} km²`}</div>
          <div>
            <PrimaryEnergyChartContainer countryCode={country.alpha2Code} />
          </div>
        </Col>
        <Col xs={0} sm={0} md={6}>
          <img
            style={{ height: '100px' }}
            src={`/img/flags/${country.alpha3Code.toLowerCase()}.svg`}
            alt={`Flag of ${country.commonName}`}
          />
          <CountryMap country={country} />
        </Col>
      </Row>
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

CountryView.propTypes = {
  country: PropTypes.shape({
    alpha2Code: PropTypes.string.isRequired,
    commonName: PropTypes.string.isRequired,
  }),
};
CountryView.defaultProps = {
  country: null,
};

export default connect((state, props) => ({
  country: countrySelector(props.match.params.countryCode, state),
}))(CountryView);
