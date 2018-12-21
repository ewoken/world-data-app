import React from 'react';
import PropTypes from 'prop-types';

import { formatNumber } from '../../../utils';

//

function CustomTooltip(props) {
  const { active, separator, payload, withTotal } = props;

  if (active && payload && payload.length > 0) {
    const { label } = props;

    if (payload.length < 2) {
      const { formatter = formatNumber, unit, color, value } = payload[0];
      return (
        <div className="CustomTooltip" style={{ color }}>
          {`${label} : ${formatter(value)} ${unit}`}
        </div>
      );
    }
    const total = payload.reduce((sum, p) => sum + p.value, 0);
    const totalUnit = payload[0].unit;

    return (
      <div className="CustomTooltip">
        <div>{label}</div>
        <div>
          {payload.map(p => {
            const {
              formatter = formatNumber,
              unit,
              color,
              name,
              dataKey,
              value,
            } = p;
            return (
              <div key={dataKey} style={{ color }}>
                {`${name}${separator}${formatter(value)} ${unit}`}
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
      color: PropTypes.string.isRequired,
      formatter: PropTypes.func,
    }).isRequired,
  ).isRequired,
  label: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  withTotal: PropTypes.bool,
};
CustomTooltip.defaultProps = {
  label: '',
  withTotal: false,
};

export default CustomTooltip;
