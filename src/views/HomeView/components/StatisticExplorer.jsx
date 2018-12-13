import React from 'react';
import PropTypes from 'prop-types';
import { Table, Select, Slider, Radio } from 'antd';

import { sortBy } from 'ramda';

import { CountryType, StatisticType } from '../../../utils/types';

function StatisticExplorer(props) {
  const {
    data,
    countries,
    statistics,
    currentStatistic,
    currentYear,
    perCapita,
    onRowClick,
    setStatistic,
    setYear,
    setPerCapita,
  } = props;

  const formatedData = data
    .filter(s => s.value !== null)
    .map(s => ({
      countryCode: s.countryCode,
      country: countries.find(c => c.alpha2Code === s.countryCode).commonName,
      value: s.value,
    }));

  return (
    <div className="StatisticExplorer">
      <Select
        style={{ width: '100%' }}
        placeholder="Statistics"
        optionFilterProp="title"
        value={currentStatistic.code}
        showSearch
        onChange={value => setStatistic(value)}
      >
        {sortBy(s => s.name, statistics).map(statistic => (
          <Select.Option key={statistic.code} title={statistic.name}>
            {`${statistic.name}`}
          </Select.Option>
        ))}
      </Select>
      <Slider
        className="hideOnMobile"
        value={currentYear}
        min={currentStatistic.startingYear}
        max={currentStatistic.endingYear}
        onChange={year => setYear(year)}
        included={false}
        marks={{
          [currentStatistic.startingYear]: {
            style: {},
            label: `${currentStatistic.startingYear}`,
          },
          [currentStatistic.endingYear]: {
            style: {
              width: 'auto',
              margin: 'auto',
              left: '',
              right: '-15px',
            }, // hack
            label: `${currentStatistic.endingYear}`,
          },
        }}
      />
      <Radio.Group
        style={{ marginBottom: '10px' }}
        buttonStyle="solid"
        size="small"
        value={perCapita}
        onChange={e => setPerCapita(e.target.value)}
      >
        <Radio.Button value={false}>Absolute</Radio.Button>
        <Radio.Button value disabled={currentStatistic.code === 'POPULATION'}>
          Per capita
        </Radio.Button>
      </Radio.Group>
      <Table
        className="hideOnMobile"
        rowKey="countryCode"
        size="small"
        pagination={false}
        dataSource={formatedData}
        scroll={{ y: 380 }}
        columns={[
          {
            title: 'Country',
            dataIndex: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country),
            width: 'auto',
            // TODO
          render: text => <a href="javascript:;">{text}</a>, // eslint-disable-line
          },
          {
            title: perCapita
              ? `${currentStatistic.baseUnit}/capita`
              : currentStatistic.unit,
            dataIndex: 'value',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.value - b.value,
            render: value => value.toLocaleString(),
            align: 'right',
          },
        ]}
        onRow={record => ({
          onClick: () => onRowClick(record),
        })}
      />
    </div>
  );
}

StatisticExplorer.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  statistics: PropTypes.arrayOf(StatisticType).isRequired,
  currentStatistic: StatisticType.isRequired,
  currentYear: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      value: PropTypes.number,
    }),
  ).isRequired,

  onRowClick: PropTypes.func.isRequired,
  setStatistic: PropTypes.func.isRequired,
  setYear: PropTypes.func.isRequired,
  perCapita: PropTypes.bool.isRequired,
  setPerCapita: PropTypes.func.isRequired,
};

export default StatisticExplorer;
