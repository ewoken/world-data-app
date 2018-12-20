import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { Row, Col, Card } from 'antd';

import { countrySelector } from '../../store/countries';

import PrimaryEnergyChartContainer from './containers/PrimaryEnergyChartContainer';
import CountryMap from './components/CountryMap';
import SummaryTab from './components/SummaryTab';
import IndependencyTab from './components/IndependencyTab';
import ClimateTab from './components/ClimateTab';

const tabList = [
  { key: 'summary', tab: 'Summary' },
  { key: 'independency', tab: 'Energy (in)dependency' },
  { key: 'climate', tab: 'Climate change' },
];

const tabContent = {
  summary: countryCode => <SummaryTab countryCode={countryCode} />,
  independency: countryCode => <IndependencyTab countryCode={countryCode} />,
  climate: countryCode => <ClimateTab countryCode={countryCode} />,
};

class CountryView extends Component {
  constructor() {
    super();
    this.state = { currentTab: 'summary' };
  }

  setTab(tabKey) {
    this.setState({ currentTab: tabKey });
  }

  render() {
    const { country } = this.props;
    const { currentTab } = this.state;

    if (!country || country.disabled) {
      return <Redirect to="/" />;
    }

    const countryCode = country.alpha2Code;
    return (
      <div className="CountryView">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={18}>
            <Card title={<h2>{country.commonName}</h2>}>
              <div>{`Capital: ${country.capital}`}</div>
              <div>{`Area: ${country.area.toLocaleString()} km²`}</div>
              <PrimaryEnergyChartContainer countryCode={country.alpha2Code} />
            </Card>
          </Col>
          <Col xs={0} sm={0} md={6}>
            <img
              style={{
                width: '100%',
                marginBottom: '20px',
                maxHeight: '180px',
              }}
              src={`/img/flags/${country.alpha3Code.toLowerCase()}.svg`}
              alt={`Flag of ${country.commonName}`}
            />
            <CountryMap country={country} />
          </Col>
        </Row>
        <Row>
          <Card
            tabList={tabList}
            activeTabKey={currentTab}
            onTabChange={tab => this.setTab(tab)}
          >
            {tabContent[currentTab](countryCode)}
          </Card>
        </Row>

        {/*  */}
        {/* <Row>
        <Col md={8} sm={24}>
          <SelfSufficiencyContainer countryCode={countryCode} />
        </Col>
        <Col md={8} sm={24}>
          <PopulationContainer countryCode={countryCode} />
        </Col>
        <Col md={8} sm={24}>
          <GrossDomesticProductContainer countryCode={countryCode} />
        </Col>
        <Col md={8} sm={24}>
          <CO2EmissionContainer countryCode={countryCode} />
        </Col>
        <Col md={8} sm={24}>
          <PrimaryEnergyContainer countryCode={countryCode} />
        </Col>
      </Row> */}
      </div>
    );
  }
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
