import React from 'react';
import PropTypes from 'prop-types';

import { Popover, Button } from 'antd';

import { StatisticType } from '../utils/types';

function StatisticSources(props) {
  const { statisticSources } = props;
  return (
    <div className="StatisticSources">
      <Popover
        title={`Source${statisticSources.length > 1 ? 's' : ''}`}
        arrowPointAtCenter
        content={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <ul className="StatisticSources__list">
            {statisticSources.map(stat => (
              <li key={stat.code}>
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${stat.name} (${stat.sourceAttribution})`}
                </a>
              </li>
            ))}
          </ul>
        }
        placement="bottomRight"
      >
        <Button size="small" icon="bars" style={{ marginRight: '5px' }} />
      </Popover>
    </div>
  );
}

StatisticSources.propTypes = {
  statisticSources: PropTypes.arrayOf(StatisticType).isRequired,
};

export default StatisticSources;
