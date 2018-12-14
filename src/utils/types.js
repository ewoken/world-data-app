import PropTypes from 'prop-types';

export const CountryType = PropTypes.shape({
  alpha2Code: PropTypes.string.isRequired,
  alpha3Code: PropTypes.string.isRequired,
  commonName: PropTypes.string.isRequired,
  capital: PropTypes.string.isRequired,
  area: PropTypes.number.isRequired,
  latlng: PropTypes.arrayOf(PropTypes.number).isRequired,
  geojson: PropTypes.object,
});

export const StatisticType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  unit: PropTypes.shape({
    main: PropTypes.string.isRequired,
    base: PropTypes.string.isRequired,
  }),
  perCapita: PropTypes.bool,
  startingYear: PropTypes.number.isRequired,
  endingYear: PropTypes.number.isRequired,
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
