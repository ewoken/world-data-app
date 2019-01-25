import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from 'antd';

import {
  fuelProducedOrConsumedCountrySelector,
  fuelProducedCountrySelector,
} from '../../../store/countries';

import IndependencyTab from './IndependencyTab';
import SummaryTab from './SummaryTab';
import ClimateTab from './ClimateTab';
import ReservesAndPeaksTab from './ReservesAndPeaksTab';

const tabList = [
  { key: 'summary', tab: 'Summary' },
  { key: 'independency', tab: 'Energy (in)dependency' },
  { key: 'climate', tab: 'Climate change' },
  { key: 'reserves', tab: 'Reserves and peaks' },
];

const IndependencyTabContainer = connect((state, props) => ({
  fuelProducedOrConsumed: fuelProducedOrConsumedCountrySelector(
    props.countryCode,
    state,
  ),
}))(IndependencyTab);

const ReservesAndPeaksTabContainer = connect((state, props) => ({
  fuelProduced: fuelProducedCountrySelector(props.countryCode, state),
}))(ReservesAndPeaksTab);

const tabContents = {
  summary: SummaryTab,
  independency: IndependencyTabContainer,
  climate: ClimateTab,
  reserves: ReservesAndPeaksTabContainer,
};

function TabsComponent(props) {
  const {
    currentTab,
    countryCode,
    onTabChange,
    setReferenceCountry,
    referenceCountryCode,
  } = props;
  const TabComponent = tabContents[currentTab];
  return (
    <Card
      key={currentTab}
      tabList={tabList}
      activeTabKey={currentTab}
      onTabChange={onTabChange}
    >
      <TabComponent
        countryCode={countryCode}
        setReferenceCountry={setReferenceCountry}
        referenceCountryCode={referenceCountryCode}
      />
    </Card>
  );
}

TabsComponent.propTypes = {
  currentTab: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  setReferenceCountry: PropTypes.func.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
};

export default TabsComponent;
