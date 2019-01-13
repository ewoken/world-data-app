import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from 'antd';

import { fuelProducedOrConsumedCountrySelector } from '../../../store/countries';

import IndependencyTab from './IndependencyTab';
import SummaryTab from './SummaryTab';
import ClimateTab from './ClimateTab';

const tabList = [
  { key: 'summary', tab: 'Summary' },
  { key: 'independency', tab: 'Energy (in)dependency' },
  { key: 'climate', tab: 'Climate change' },
];

const IndependencyTabContainer = connect((state, props) => ({
  fuelProducedOrConsumed: fuelProducedOrConsumedCountrySelector(
    props.countryCode,
    state,
  ),
}))(IndependencyTab);

const tabContent = {
  summary: countryCode => <SummaryTab countryCode={countryCode} />,
  independency: countryCode => (
    <IndependencyTabContainer countryCode={countryCode} />
  ),
  climate: countryCode => <ClimateTab countryCode={countryCode} />,
};

function TabsComponent(props) {
  const { currentTab, countryCode, onTabChange } = props;
  return (
    <Card
      key={currentTab}
      tabList={tabList}
      activeTabKey={currentTab}
      onTabChange={onTabChange}
    >
      {tabContent[currentTab](countryCode)}
    </Card>
  );
}

TabsComponent.propTypes = {
  currentTab: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TabsComponent;
