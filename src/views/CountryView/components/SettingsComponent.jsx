import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'ramda';

import { Select } from 'antd';

import { CountryType } from '../../../utils/types';

function SettingsComponent(props) {
  const { countries, setReferenceCountry, referenceCountryCode } = props;
  return (
    <div className="SettingComponent">
      {'Compare to : '}
      <Select
        value={referenceCountryCode}
        placeholder="Select a country or a zone"
        optionFilterProp="title"
        showSearch
        style={{ width: '250px' }}
        onSelect={countryCode => setReferenceCountry(countryCode)}
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
    </div>
  );
}

SettingsComponent.propTypes = {
  countries: PropTypes.arrayOf(CountryType).isRequired,
  setReferenceCountry: PropTypes.func.isRequired,
  referenceCountryCode: PropTypes.string.isRequired,
};

export default SettingsComponent;
