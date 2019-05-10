import React, { Component } from 'react';
import { values } from 'ramda';
import { withStateHandlers, compose, defaultProps } from 'recompose';
import qs from 'qs';
import { withRouter } from 'react-router-dom';

import { Icon, Popover, Button } from 'antd';

import { displayUnit } from '../utils';
import StatisticDetails from '../components/StatisticDetails';

import ChartSettings from './components/ChartSettings';
import ShareChartComponent from '../components/ShareChartComponent';
import withCountryStatistics from './withCountryStatistics';

const defaultHeight = 200;

export function buildChartWrapper(WrappedChart) {
  return class ChartWrapper extends Component {
    constructor() {
      super();
      this.chartRef = React.createRef();
      this.buttonRef = React.createRef();
    }

    render() {
      const {
        title,
        description,
        statistics,
        statisticSources,
        perCapita,
        stacked,
        setPerCapita,
        setStacked,
        data,
        withReference,
        referenceCountryCode,
        location,
        perCapitaSwitch,
        stackedSwitch,
        hasSettings,
      } = this.props;
      const statisticList = values(statistics);
      const statistic = statisticList[0];
      const id = (title
        ? title.replace(/ /g, '_')
        : statistic.name.replace(/ /g, '_')
      ).toLowerCase();

      const descriptionStatistic = statisticList.find(
        s => s.code === description,
      );
      const finalDescription =
        statisticList.length < 2
          ? description || statistic.description
          : (descriptionStatistic && descriptionStatistic.description) ||
            description;
      const hash = location.hash.substr(1);
      const style =
        hash === id
          ? {
              boxShadow: '0px 0px 10px 1px rgba(0,0,0,0.5)',
            }
          : {};

      return (
        <div id={id} className="ChartWrapper" ref={this.chartRef} style={style}>
          <div className="ChartWrapper__header">
            <div className="ChartWrapper__header__left">
              <span className="ChartWrapper__title">
                {title || statistic.name}
              </span>
              <span className="ChartWrapper__title__unit">
                {statistic.unit.main === ''
                  ? ''
                  : ` (${displayUnit(statistic.unit, perCapita)})`}
              </span>
            </div>
            <div
              className="ChartWrapper__header__right"
              data-html2canvas-ignore
            >
              <ShareChartComponent
                id={id}
                chartRef={this.chartRef}
                statistics={{ year: { code: 'YEAR' }, ...statistics }}
                data={data}
                {...(withReference
                  ? {
                      query: `?${qs.stringify({
                        referenceCountry: referenceCountryCode,
                      })}`,
                    }
                  : {})}
              />
              <StatisticDetails
                statisticSources={statisticSources}
                description={finalDescription}
              />
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
          <WrappedChart {...this.props} />
          <div className="ChartWrapper__footer toPng">
            From http://worldenergydata.tk - Sources: IEA, World Bank
          </div>
        </div>
      );
    }
  };
}

function buildChart(options = {}) {
  const {
    mapOfCountryStatisticsSelector,
    perCapitaSwitch = false,
    stackedSwitch = false,
    height = defaultHeight,
  } = options;
  const hasSettings = perCapitaSwitch || stackedSwitch;
  const hocs = [
    withRouter,
    defaultProps({
      perCapitaSwitch,
      stackedSwitch,
      hasSettings,
      height,
      perCapita: false,
      stacked: false,
    }),
  ];

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
  hocs.push(buildChartWrapper);

  return compose(...hocs);
}

export default buildChart;
