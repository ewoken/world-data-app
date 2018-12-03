import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { sortBy, prop } from 'ramda';

import { Row, Col, Select } from 'antd';
import StatisticChart from '../components/StatisticChart';

import { countriesSelector } from '../store/countries';
import { allStatisticsSelector } from '../store/statistics';

class ChartView extends Component {
  constructor() {
    super();

    this.state = {};
  }

  setCountry(countryCode) {
    this.setState(state => ({
      ...state,
      countryCode,
    }));
  }

  setStatistic(statisticCode) {
    this.setState(state => ({
      ...state,
      statisticCode,
    }));
  }

  render() {
    const { countries, statistics } = this.props;
    const { statisticCode, countryCode } = this.state;
    return (
      <div className="ChartView">
        <Row type="flex" justify="center">
          <h2>Select a country</h2>
        </Row>
        <Row type="flex" justify="center">
          <Col span={10}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Countries"
              maxTagCount={3}
              optionFilterProp="title"
              showSearch
              onSelect={value => {
                this.setCountry(value);
              }}
            >
              {sortBy(prop('commonName'), countries).map(country => (
                <Select.Option
                  key={country.alpha2Code}
                  title={`${country.commonName} (${country.alpha3Code})`}
                >
                  {country.commonName}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <h2>or a statistic</h2>
        </Row>
        <Row type="flex" justify="center">
          <Col span={10}>
            <Select
              style={{ width: '100%' }}
              size="large"
              placeholder="Statistics"
              maxTagCount={3}
              optionFilterProp="title"
              showSearch
              onSelect={value => {
                this.setStatistic(value);
              }}
            >
              {sortBy(prop('name'), statistics).map(statistic => (
                <Select.Option key={statistic.code} title={`${statistic.name}`}>
                  {statistic.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <StatisticChart
          countryCode={countryCode}
          statisticCode={statisticCode}
        />
      </div>
    );
  }
}

ChartView.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      alpha2Code: PropTypes.string.isRequired,
      commonName: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  statistics: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default connect(state => ({
  countries: countriesSelector(state),
  statistics: allStatisticsSelector(state),
}))(ChartView);
