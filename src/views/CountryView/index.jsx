import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { Row, Col, Card } from 'antd';

import { countrySelector } from '../../store/countries';

import CountryMap from './components/CountryMap';
import SummaryTab from './components/SummaryTab';
import IndependencyTab from './components/IndependencyTab';
import ClimateTab from './components/ClimateTab';

import BasicChart from './components/BasicChart';
import withCountryStatistics from '../../HOC/withCountryStatistics';

const [PopulationChart, GDPChart] = ['POPULATION', 'GDP_2010_USD'].map(
  statisticCode =>
    withCountryStatistics({
      value: statisticCode,
    })(BasicChart),
);

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
              <Row style={{ marginTop: '20px' }} gutter={10}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <PopulationChart countryCode={countryCode} color="#2c82c9" />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <GDPChart
                    countryCode={countryCode}
                    color="#f22613"
                    perCapita
                  />
                </Col>
              </Row>
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
