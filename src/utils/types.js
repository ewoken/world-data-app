import PropTypes from 'prop-types';

export const CountryType = PropTypes.shape({
  alpha2Code: PropTypes.string.isRequired,
  alpha3Code: PropTypes.string.isRequired,
  commonName: PropTypes.string.isRequired,
  capital: PropTypes.string.isRequired,
  area: PropTypes.number.isRequired,
  latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
  geojson: PropTypes.object,
  firstYear: PropTypes.number.isRequired,
  lastYear: PropTypes.number.isRequired,
});

export const StatisticType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  unit: PropTypes.shape({
    main: PropTypes.string.isRequired,
    base: PropTypes.string.isRequired,
  }),
  perCapita: PropTypes.bool,
  startingYear: PropTypes.number.isRequired,
  endingYear: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  sourceAttribution: PropTypes.string,
  sourceUrl: PropTypes.string,
  sourceDescriptionUrl: PropTypes.string,
});

export const StatisticValues = PropTypes.arrayOf(
  PropTypes.shape({
    year: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
);

export const AreaType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.string),
  countries: PropTypes.arrayOf(CountryType),
});

export const LocationType = PropTypes.shape({
  hash: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
});

export const FuelIndicatorsType = PropTypes.shape({
  coal: PropTypes.bool,
  oil: PropTypes.bool,
  gas: PropTypes.bool,
});
