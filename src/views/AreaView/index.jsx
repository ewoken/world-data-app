import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { Row, Col, Card } from 'antd';
import { AreaType } from '../../utils/types';

import GeoJSONMap from '../../components/GeoJSONMap';
import SummaryTab from '../CountryView/components/SummaryTab';
import IndependencyTab from '../CountryView/components/IndependencyTab';
import ClimateTab from '../CountryView/components/ClimateTab';

import BasicChart from '../CountryView/components/BasicChart';
import withCountryStatistics from '../../HOC/withCountryStatistics';

import { areaWithCountriesSelector } from '../../store/otherSelectors';

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
  summary: areaCode => <SummaryTab countryCode={areaCode} />,
  independency: areaCode => <IndependencyTab countryCode={areaCode} />,
  climate: areaCode => <ClimateTab countryCode={areaCode} />,
};

class AreaView extends Component {
  constructor() {
    super();
    this.state = { currentTab: 'summary' };
  }

  setTab(tabKey) {
    this.setState({ currentTab: tabKey });
  }

  render() {
    const { area } = this.props;
    const { currentTab } = this.state;
    const latlng = [
      area.countries.reduce((s, c) => c.latlng[0] + s, 0) /
        area.countries.length,
      area.countries.reduce((s, c) => c.latlng[1] + s, 0) /
        area.countries.length,
    ];

    if (!area) {
      return <Redirect to="/" />;
    }

    return (
      <div className="AreaView">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={18}>
            <Card title={<h2>{`${area.name}`}</h2>}>
              {area.code !== 'WORLD' && (
                <div>
                  {`Members : `}
                  {area.countries.map((country, i) => (
                    <Link
                      key={country.alpha2Code}
                      to={`/country/${country.alpha2Code}`}
                    >
                      {`${i > 0 ? ', ' : ''}${country.commonName}`}
                    </Link>
                  ))}
                </div>
              )}
              <Row style={{ marginTop: '20px' }} gutter={10}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <PopulationChart countryCode={area.code} color="#2c82c9" />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <GDPChart countryCode={area.code} color="#f22613" perCapita />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={0} sm={0} md={6}>
            <GeoJSONMap geojson={area.geojson} center={latlng} />
          </Col>
        </Row>
        <Row>
          <Card
            tabList={tabList}
            activeTabKey={currentTab}
            onTabChange={tab => this.setTab(tab)}
          >
            {tabContent[currentTab](area.code)}
          </Card>
        </Row>
      </div>
    );
  }
}

AreaView.propTypes = {
  area: AreaType.isRequired,
};

export default connect((state, props) => ({
  area: areaWithCountriesSelector(props.match.params.areaCode, state),
}))(AreaView);
