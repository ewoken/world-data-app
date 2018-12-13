import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadAllCountries } from '../store/countries';
import {
  loadAllStatistics,
  loadStatisticOfCountries,
} from '../store/statistics';

export function withLoader(config) {
  const {
    loadFunctions,
    isLoadedSelector = () => false,
    mapStateToProps = () => {},
  } = config;

  const loadAll = props => (dispatch, getState) =>
    loadFunctions.map(loadFunction => loadFunction(props)(dispatch, getState));

  return function wrapLoaderHOC(WrappedComponent) {
    const ConnectedWrappedComponent = WrappedComponent
      ? connect(mapStateToProps)(WrappedComponent)
      : () => null;

    return connect(
      (state, props) => ({
        isLoaded: isLoadedSelector(props, state),
      }),
      { load: loadAll },
    )(
      class LoaderComponent extends Component {
        static propTypes = {
          load: PropTypes.func.isRequired,
          isLoaded: PropTypes.bool.isRequired,
        };

        componentDidMount() {
          const { load, isLoaded, ...args } = this.props;
          load(args);
        }

        render() {
          const { isLoaded, load, ...otherProps } = this.props;

          if (!isLoaded) {
            return null;
          }
          return <ConnectedWrappedComponent {...otherProps} />;
        }
      },
    );
  };
}

export const CountriesLoader = withLoader({
  loadFunctions: [loadAllCountries],
})();

export const StatisticsLoader = withLoader({
  loadFunctions: [loadAllStatistics],
})();

export const StatisticAllCountriesLoader = withLoader({
  loadFunctions: [
    ({ statisticCode }) => loadStatisticOfCountries(statisticCode),
  ],
})();
