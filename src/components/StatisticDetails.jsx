import React from 'react';
import PropTypes from 'prop-types';

import { Popover, Button } from 'antd';

import { StatisticType } from '../utils/types';

function StatisticDetails(props) {
  const { statisticSources, description } = props;
  const descriptionLines = description && description.split('\n');

  return (
    <div className="StatisticDetails">
      <Popover
        title="Details"
        arrowPointAtCenter
        overlayStyle={{ maxWidth: '300px' }}
        content={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <div>
            {description && (
              <div>
                <strong>Description : </strong>
                {`${descriptionLines[0]}`}
              </div>
            )}
            <div>
              <strong>
                {`Source${statisticSources.length > 1 ? 's' : ''}`}
              </strong>
              <ul className="StatisticDetails__sources">
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
            </div>
          </div>
        }
        placement="bottomRight"
      >
        <Button
          size="small"
          icon="info-circle"
          style={{ marginRight: '5px' }}
        />
      </Popover>
    </div>
  );
}

StatisticDetails.propTypes = {
  description: PropTypes.string,
  statisticSources: PropTypes.arrayOf(StatisticType).isRequired,
};

StatisticDetails.defaultProps = {
  description: null,
};

export default StatisticDetails;
