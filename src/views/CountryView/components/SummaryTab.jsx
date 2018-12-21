import React from 'react';
import PropTypes from 'prop-types';

import PrimaryEnergyChartContainer from '../containers/PrimaryEnergyChartContainer';
import ElectricityMixChartContainer from '../containers/ElectricityMixChartContainer';

function SummaryTab(props) {
  const { countryCode } = props;
  return (
    <div className="SummaryTab">
      <PrimaryEnergyChartContainer countryCode={countryCode} />
      <ElectricityMixChartContainer countryCode={countryCode} />
    </div>
  );
}

SummaryTab.propTypes = {
  countryCode: PropTypes.string.isRequired,
};

export default SummaryTab;
