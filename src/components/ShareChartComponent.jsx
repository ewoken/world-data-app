import React from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import { Button, Dropdown, Menu, Icon } from 'antd';
import { chartToPngBlob } from '../utils';

function ShareChartComponent(props) {
  return (
    <div className="ShareChartComponent">
      <Dropdown
        overlay={
          // eslint-disable-next-line
          <Menu
            onClick={({ key }) => {
              if (key === 'png') {
                const { chartRef, filename } = props;
                chartToPngBlob(chartRef.current, 2)
                  .then(blob => saveAs(blob, `${filename}.png`))
                  .catch(err => console.err(err));
              } else if (key === 'csv') {
                const { data, statistics, filename } = props;
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
                saveAs(blob, `${filename}.csv`);
              }
            }}
          >
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
  filename: PropTypes.string.isRequired,
};

export default ShareChartComponent;
