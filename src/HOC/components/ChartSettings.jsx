import React from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'antd';

function ChartSettings(props) {
  const {
    perCapitaSwitch,
    stackedSwitch,
    perCapita,
    stacked,
    setPerCapita,
    setStacked,
  } = props;

  return (
    <div className="ChartSettings">
      {perCapitaSwitch && (
        <div>
          {'Per capita '}
          <Switch size="small" checked={perCapita} onChange={setPerCapita} />
        </div>
      )}
      {stackedSwitch && (
        <div>
          {'Stacked '}
          <Switch size="small" checked={stacked} onChange={setStacked} />
        </div>
      )}
    </div>
  );
}
ChartSettings.propTypes = {
  perCapitaSwitch: PropTypes.bool.isRequired,
  stackedSwitch: PropTypes.bool.isRequired,
  perCapita: PropTypes.bool.isRequired,
  stacked: PropTypes.bool.isRequired,
  setPerCapita: PropTypes.func.isRequired,
  setStacked: PropTypes.func.isRequired,
};

export default ChartSettings;
