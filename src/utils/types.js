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
  unit: PropTypes.string.isRequired,
  startingYear: PropTypes.number.isRequired,
  endingYear: PropTypes.number.isRequired,
});

export const StatisticValues = PropTypes.arrayOf(
  PropTypes.shape({
    year: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
);
