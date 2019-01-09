import React from 'react';
import PropTypes from 'prop-types';

import { formatNumber } from '../../../utils';

function CustomTooltip(props) {
  const { active, separator, payload, withTotal } = props;

  if (active && payload && payload.length > 0) {
    const { label, displayFilter, totalFilter, units } = props;
    const filteredPayload = payload.filter(displayFilter);

    if (filteredPayload.length < 2) {
      const { formatter = formatNumber, unit, color, value } = payload[0];
      return (
        <div className="CustomTooltip" style={{ color }}>
          {`${label} : ${formatter(value)} ${unit}`}
        </div>
      );
    }
    const total = payload
      .filter(totalFilter)
      .reduce((sum, p) => sum + p.value, 0);
    const totalUnit = filteredPayload[0].unit;

    return (
      <div className="CustomTooltip">
        <div>{label}</div>
        <div>
          {filteredPayload.map((p, i) => {
            const {
              formatter = formatNumber,
              unit,
              color,
              name,
              dataKey,
              value,
            } = p;
            return (
              <div key={dataKey || name} style={{ color }}>
                {`${name}${separator}${formatter(value)} ${unit || units[i]}`}
              </div>
            );
          })}
          {withTotal && (
            <div key="__total__">
              <hr size={1} />
              {`Total${separator}${formatNumber(total)} ${totalUnit}`}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  separator: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      color: PropTypes.string,
      formatter: PropTypes.func,
    }).isRequired,
  ).isRequired,
  label: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  withTotal: PropTypes.bool,
  displayFilter: PropTypes.func,
  totalFilter: PropTypes.func,
  units: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};
CustomTooltip.defaultProps = {
  label: '',
  withTotal: false,
  displayFilter: i => i,
  totalFilter: i => i,
  units: {},
};

export default CustomTooltip;
