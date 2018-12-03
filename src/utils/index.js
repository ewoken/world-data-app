import PropTypes from 'prop-types';
import { values, mapObjIndexed, mergeAll, groupBy } from 'ramda';

// eslint-disable-next-line import/prefer-default-export
export function compileStatistics(mapOfStatisticValues) {
  const arrayOfStatisticValues = values(mapOfStatisticValues);

  const startingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.min(...statisticValues.map(v => v.year)),
  );
  const endingYears = arrayOfStatisticValues.map(statisticValues =>
    Math.max(...statisticValues.map(v => v.year)),
  );

  const startingYear = Math.max(...startingYears);
  const endingYear = Math.min(...endingYears);

  const mapOfNamedStatisticValues = mapObjIndexed(
    (statisticValues, compileName) =>
      statisticValues.map(({ year, value }) => ({
        year,
        [compileName]: value,
      })),
    mapOfStatisticValues,
  );
  const allValues = [].concat(...values(mapOfNamedStatisticValues));
  const allValuesByYear = groupBy(value => value.year, allValues);
  const compiledStatistics = Object.keys(allValuesByYear)
    .sort()
    .map(year => {
      const valuesOfYear = allValuesByYear[year];

      return mergeAll(valuesOfYear);
    })
    .filter(value => startingYear <= value.year && value.year <= endingYear);

  return compiledStatistics;
}

// TODO types ?
export const StatisticValues = PropTypes.arrayOf(
  PropTypes.shape({
    year: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
);
