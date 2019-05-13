import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from 'antd';

import {
  fuelProducedOrConsumedCountrySelector,
  fuelProducedCountrySelector,
} from '../../../store/countries';
import { statisticPeakYearSelector } from '../../../store/statistics';

import { FuelIndicatorsType } from '../../../utils/types';

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

const ReservesAndPeaksTabContainer = connect((state, { countryCode }) => ({
  fuelProduced: fuelProducedCountrySelector(countryCode, state),
  peaks: {
    coal: statisticPeakYearSelector(
      {
        countryCode,
        statisticCode: 'COAL_PRODUCTION_MTOE',
      },
      state,
    ),
    oil: statisticPeakYearSelector(
      {
        countryCode,
        statisticCode: 'OIL_PRODUCTION_MTOE',
      },
      state,
    ),
    gas: statisticPeakYearSelector(
      {
        countryCode,
        statisticCode: 'GAS_PRODUCTION_MTOE',
      },
      state,
    ),
  },
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
    fuelProduced,
    hasRents,
  } = props;
  const TabComponent = tabContents[currentTab];
  const hasProducedFossils =
    fuelProduced.coal || fuelProduced.oil || fuelProduced.gas;
  const tabs = hasProducedFossils
    ? tabList
    : tabList.filter(d => d.key !== 'reserves');

  return (
    <Card
      key={currentTab}
      tabList={tabs}
      activeTabKey={currentTab}
      onTabChange={onTabChange}
    >
      <TabComponent
        countryCode={countryCode}
        setReferenceCountry={setReferenceCountry}
        referenceCountryCode={referenceCountryCode}
        hasRents={hasRents}
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
  fuelProduced: FuelIndicatorsType.isRequired,
  hasRents: PropTypes.bool.isRequired,
};

export default TabsComponent;
