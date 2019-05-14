import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { withState } from 'recompose';
import qs from 'qs';

import { Row, Col, Card } from 'antd';

import { fuelProducedCountrySelector } from '../../store/countries';
import { countryWithAreasSelector } from '../../store/otherSelectors';

import { CountryType, FuelIndicatorsType } from '../../utils/types';
import { isMobileOrTablet } from '../../utils';

import BasicChartContainer from './containers/BasicChartContainer';

import GeoJSONMap from '../../components/GeoJSONMap';
import ScrollToTop from '../../components/ScrollToTop';
import TabsComponent from './components/TabsComponent';

const TabsComponentWithState = withState(
  'referenceCountryCode',
  'setReferenceCountry',
  props => props.referenceCountry,
)(TabsComponent);

function CountryView(props) {
  const { country, goTo, currentTab, referenceCountry, fuelProduced } = props;

  if (!country || country.disabled) {
    return <Redirect to="/" />;
  }

  const countryCode = country.alpha2Code;
  const flag = isMobileOrTablet() ? country.flagIcon : '';
  return (
    <div className="CountryView">
      <ScrollToTop countryCode={countryCode} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={18}>
          <Card title={<h2>{`${flag} ${country.commonName}`}</h2>}>
            <div>{`Capital: ${country.capital}`}</div>
            <div>{`Area: ${country.area.toLocaleString()} km²`}</div>
            <div>
              {`Member of: `}
              {country.areas.map((area, i) => (
                <Link key={area.code} to={`/area/${area.code}`}>
                  {`${i > 0 ? ', ' : ''}${area.name}`}
                </Link>
              ))}
            </div>
            <Row style={{ marginTop: '20px' }} gutter={20}>
              <Col xs={24} sm={24} md={24} lg={8}>
                <BasicChartContainer
                  statisticCode="POPULATION"
                  countryCode={countryCode}
                  color="#2c82c9"
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <BasicChartContainer
                  statisticCode="GDP_2010_USD"
                  countryCode={countryCode}
                  color="#f22613"
                  perCapita
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <BasicChartContainer
                  statisticCode="HUMAN_DEVELOPMENT_INDEX"
                  countryCode={countryCode}
                  color="green"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={0} sm={0} md={6}>
          <img
            key={countryCode}
            style={{
              width: '100%',
              marginBottom: '20px',
              maxHeight: '180px',
            }}
            src={`/img/flags/${country.alpha3Code.toLowerCase()}.svg`}
            alt={`Flag of ${country.commonName}`}
          />
          <GeoJSONMap geojson={country.geojson} center={country.latlng} />
        </Col>
      </Row>
      <Row>
        <TabsComponentWithState
          countryCode={countryCode}
          currentTab={currentTab}
          onTabChange={tab => goTo(`/country/${countryCode}/${tab}`)}
          referenceCountry={referenceCountry}
          fuelProduced={fuelProduced}
          hasRents={country.hasRents}
        />
      </Row>
    </div>
  );
}

CountryView.propTypes = {
  currentTab: PropTypes.string,
  country: CountryType,
  goTo: PropTypes.func.isRequired,
  referenceCountry: PropTypes.string,
  fuelProduced: FuelIndicatorsType.isRequired,
};
CountryView.defaultProps = {
  currentTab: 'summary',
  country: null,
  referenceCountry: 'WORLD',
};

export default connect((state, props) => ({
  currentTab: props.match.params.tab,
  goTo: url => props.history.push(url),
  country: countryWithAreasSelector(props.match.params.countryCode, state),
  referenceCountry: qs.parse(props.location.search.substr(1)).referenceCountry,
  fuelProduced: fuelProducedCountrySelector(
    props.match.params.countryCode,
    state,
  ),
}))(CountryView);
