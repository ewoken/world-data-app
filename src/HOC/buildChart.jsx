import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { values } from 'ramda';
import { withStateHandlers, compose } from 'recompose';
import { saveAs } from 'file-saver';

import { Icon, Popover, Switch, Button } from 'antd';

import withCountryStatistics from './withCountryStatistics';
import { displayUnit, chartToPngBlob } from '../utils';
import StatisticSources from '../components/StatisticSources';

const defaultHeight = 200;

function ChartSettings(props) {
  const {
    perCapitaSwitch,
    stackedSwitch,
    perCapita,
    stacked,
    setPerCapita,
    setStacked,
  } = props;

  return (
    <div className="ChartSettings">
      {perCapitaSwitch && (
        <div>
          {'Per capita '}
          <Switch size="small" checked={perCapita} onChange={setPerCapita} />
        </div>
      )}
      {stackedSwitch && (
        <div>
          {'Stacked '}
          <Switch size="small" checked={stacked} onChange={setStacked} />
        </div>
      )}
    </div>
  );
}
ChartSettings.propTypes = {
  perCapitaSwitch: PropTypes.bool.isRequired,
  stackedSwitch: PropTypes.bool.isRequired,
  perCapita: PropTypes.bool.isRequired,
  stacked: PropTypes.bool.isRequired,
  setPerCapita: PropTypes.func.isRequired,
  setStacked: PropTypes.func.isRequired,
};

function buildChart(options = {}) {
  const {
    mapOfCountryStatisticsSelector,
    perCapitaSwitch = false,
    stackedSwitch = false,
  } = options;
  const hocs = [];
  const hasSettings = perCapitaSwitch || stackedSwitch;

  if (hasSettings) {
    hocs.push(
      withStateHandlers(
        ({ defaultPerCapita = false, defaultStacked = false }) => ({
          perCapita: defaultPerCapita,
          stacked: defaultStacked,
        }),
        {
          setPerCapita: () => perCapita => ({ perCapita }),
          setStacked: () => stacked => ({ stacked }),
        },
      ),
    );
  }
  hocs.push(withCountryStatistics(mapOfCountryStatisticsSelector));

  return function buildChartWrapper(WrappedChart) {
    return compose(...hocs)(
      class ChartWrapper extends Component {
        constructor() {
          super();
          this.chartRef = React.createRef();
          this.buttonRef = React.createRef();
        }

        render() {
          const {
            title,
            statistics,
            statisticSources,
            height,
            perCapita,
            stacked,
            setPerCapita,
            setStacked,
          } = this.props;

          const statistic = values(statistics)[0];
          const finalHeight = options.height || height || defaultHeight;
          const file = title
            ? title.replace(/ /g, '_')
            : statistic.name.replace(/ /g, '_');

          return (
            <div className="ChartWrapper" ref={this.chartRef}>
              <div className="ChartWrapper__header">
                <div className="ChartWrapper__header__left">
                  <span className="ChartWrapper__title">
                    {title || statistic.name}
                  </span>
                  <span className="ChartWrapper__title__unit">
                    {` (${displayUnit(statistic.unit, perCapita)})`}
                  </span>
                </div>
                <div
                  className="ChartWrapper__header__right"
                  data-html2canvas-ignore
                >
                  <div style={{ marginRight: '5px' }}>
                    <Button
                      icon="download"
                      size="small"
                      onClick={() => {
                        chartToPngBlob(this.chartRef.current, 2)
                          .then(blob => saveAs(blob, `${file}.png`))
                          .catch(err => console.err(err));
                      }}
                    />
                  </div>
                  <StatisticSources statisticSources={statisticSources} />
                  {hasSettings && (
                    <div>
                      <Popover
                        title="Settings"
                        arrowPointAtCenter
                        content={
                          // eslint-disable-next-line react/jsx-wrap-multilines
                          <ChartSettings
                            perCapitaSwitch={perCapitaSwitch}
                            stackedSwitch={stackedSwitch}
                            stacked={stacked}
                            perCapita={perCapita}
                            setPerCapita={setPerCapita}
                            setStacked={setStacked}
                          />
                        }
                        placement="bottomRight"
                      >
                        <Button size="small">
                          <Icon type="setting" theme="filled" />
                        </Button>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
              <WrappedChart
                {...this.props}
                height={finalHeight}
                perCapita={perCapita}
                stacked={stacked}
              />
              <div className="ChartWrapper__footer" />
            </div>
          );
        }
      },
    );
  };
}

export default buildChart;
