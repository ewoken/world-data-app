import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sortBy } from 'ramda';

import { Menu, Select } from 'antd';
import GitHubLink from './GitHubLink';

import { CountryType, AreaType } from '../utils/types';
import { isMobileOrTablet } from '../utils';

function HeaderMenu(props) {
  const { countries, areas, goTo } = props;
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
          placeholder="Select a country"
          optionFilterProp="title"
          showSearch={!isMobileOrTablet()}
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
      <Menu.SubMenu title="Areas">
        {sortBy(a => a.name, areas).map(area => (
          <Menu.Item key={area.code}>
            <Link to={`/area/${area.code}`}>{area.name}</Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Item key="about">
        <Link to="/about">About</Link>
      </Menu.Item>
      <Menu.Item>
        <GitHubLink />
      </Menu.Item>
    </Menu>
  );
}

HeaderMenu.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  areas: PropTypes.arrayOf(AreaType).isRequired,
  goTo: PropTypes.func.isRequired,
};

export default HeaderMenu;
