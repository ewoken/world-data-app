import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sortBy } from 'ramda';

import { Menu, Select } from 'antd';
import GitHubLink from './GitHubLink';

import { CountryType } from '../utils/types';

function HeaderMenu(props) {
  const { countries, goTo } = props;
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      selectable={false}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="home">
        <Link to="/home">
          <strong>World Energy Data</strong>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Select
          id="mainCountrySelect"
          placeholder="Countries"
          optionFilterProp="title"
          showSearch
          onSelect={value => {
            goTo(`/country/${value}`);
          }}
        >
          {sortBy(c => c.commonName, countries).map(country => (
            <Select.Option
              key={country.alpha2Code}
              disabled={country.disabled}
              title={`${country.commonName} (${country.alpha3Code})`}
            >
              {`${country.commonName}${country.disabled ? ' (No data)' : ''}`}
            </Select.Option>
          ))}
        </Select>
      </Menu.Item>
      <Menu.Item>
        <GitHubLink />
      </Menu.Item>
    </Menu>
  );
}

HeaderMenu.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  goTo: PropTypes.func.isRequired,
};

export default HeaderMenu;
