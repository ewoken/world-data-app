import React from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import { Button, Dropdown, Menu, Icon, message } from 'antd';
import { chartToPngBlob } from '../utils';
import copyToClipboard from '../utils/copyToClipboard';

function ShareChartComponent(props) {
  const { id, chartRef } = props;
  return (
    <div className="ShareChartComponent">
      <Dropdown
        overlay={
          // eslint-disable-next-line
          <Menu
            onClick={({ key }) => {
              if (key === 'png') {
                chartToPngBlob(chartRef.current, 2)
                  .then(blob => saveAs(blob, `${id}.png`))
                  .catch(() => message.error('An error occured !'));
              } else if (key === 'csv') {
                const { data, statistics } = props;
                const compileNames = Object.keys(statistics);
                const headers = compileNames.map(
                  compileName => statistics[compileName].code,
                );
                const dataLines = data.map(dataItem =>
                  compileNames.map(compileName => dataItem[compileName]),
                );
                const lines = [headers, ...dataLines];
                const csv = lines.map(l => l.join(',')).join('\n');
                const blob = new Blob([csv], {
                  type: 'text/plain;charset=utf-8',
                });
                saveAs(blob, `${id}.csv`);
              } else if (key === 'link') {
                const { location } = window;
                const hashParts = location.hash.split('#');

                const link = `${location.origin + location.pathname}#${
                  hashParts[1]
                }#${id}`;
                copyToClipboard(link, chartRef.current)
                  .then(() => message.success('Copied !'))
                  .catch(() => message.error('An error occured !'));
              }
            }}
          >
            <Menu.Item key="link">
              <Icon type="copy" theme="filled" />
              Copy link
            </Menu.Item>
            <Menu.Item key="png">
              <Icon type="picture" theme="filled" />
              .png
            </Menu.Item>
            <Menu.Item key="csv">
              <Icon type="file-text" theme="filled" />
              .csv
            </Menu.Item>
          </Menu>
        }
      >
        <Button size="small" icon="share-alt" style={{ marginRight: '5px' }} />
      </Dropdown>
    </div>
  );
}

ShareChartComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  chartRef: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  statistics: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
};

export default ShareChartComponent;
