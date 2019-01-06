import React from 'react';
import PropTypes from 'prop-types';
import { Table, Select, Slider, Radio } from 'antd';
import debounce from 'lodash.debounce';

import { sortBy, groupBy } from 'ramda';

import StatisticSources from '../../../components/StatisticSources';

import { CountryType, StatisticType } from '../../../utils/types';
import { isMobileOrTablet, formatNumber, displayUnit } from '../../../utils';

function StatisticExplorer(props) {
  const {
    data,
    countries,
    statistics,
    currentStatistic,
    statisticSources,
    currentYear,
    perCapita,
    onRowClick,
    setStatistic,
    setYear,
    setPerCapita,
    isLoaded,
  } = props;

  const formatedData = data
    .filter(s => s.value !== null)
    .map(s => ({
      countryCode: s.countryCode,
      country:
        s.countryCode === 'WORLD'
          ? 'World'
          : countries.find(c => c.alpha2Code === s.countryCode).commonName,
      value: s.value,
    }));

  const statisticByCategory = groupBy(s => s.category, statistics);

  return (
    <div className="StatisticExplorer">
      <Select
        style={{ width: '100%' }}
        placeholder="Statistics"
        optionFilterProp="title"
        value={currentStatistic.code}
        showSearch={!isMobileOrTablet()}
        onChange={value => setStatistic(value)}
      >
        {Object.keys(statisticByCategory).map(category => {
          const stats = statisticByCategory[category];
          return (
            <Select.OptGroup key={category} label={category}>
              {sortBy(s => s.name, stats).map(statistic => (
                <Select.Option key={statistic.code} title={statistic.name}>
                  {`${statistic.name}`}
                </Select.Option>
              ))}
            </Select.OptGroup>
          );
        })}
      </Select>
      <Slider
        className="hideOnMobile"
        defaultValue={currentYear}
        min={currentStatistic.startingYear}
        max={currentStatistic.endingYear}
        onAfterChange={year => setYear(year)}
        onChange={debounce(setYear, 300)}
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
      <div className="StatisticExplorer__options">
        <Radio.Group
          style={{ marginBottom: '10px' }}
          buttonStyle="solid"
          size="small"
          value={perCapita}
          onChange={e => setPerCapita(e.target.value)}
        >
          <Radio.Button value={false}>Absolute</Radio.Button>
          <Radio.Button
            value
            disabled={
              currentStatistic.code === 'POPULATION' ||
              currentStatistic.isIntensive
            }
          >
            Per capita
          </Radio.Button>
        </Radio.Group>
        <StatisticSources statisticSources={statisticSources} />
      </div>
      <Table
        className="hideOnMobile"
        rowKey="countryCode"
        size="small"
        pagination={false}
        dataSource={formatedData}
        loading={!isLoaded}
        scroll={{ y: 380 }}
        columns={[
          {
            title: 'Country',
            dataIndex: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country),
            width: 'auto',
            // TODO
            render: text =>
              text === 'World' ? (
                <strong>World</strong>
              ) : (
              <a href="javascript:;">{text}</a>), // eslint-disable-line
          },
          {
            title: displayUnit(currentStatistic.unit, perCapita),
            dataIndex: 'value',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.value - b.value,
            render: formatNumber,
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
  statisticSources: PropTypes.arrayOf(StatisticType).isRequired,
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
  isLoaded: PropTypes.bool.isRequired,
};

export default StatisticExplorer;
