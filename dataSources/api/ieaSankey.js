const countries = require('world-countries/countries');
const convert = require('xml-js');
const { memoizeWith, indexBy, range } = require('ramda');

const { retryFetch } = require('./helpers');

const IEA_SANKEY_API = 'IEA_SANKEY_API';
const OTHER_MAP = {
  'Plurinational state of Bolivia': 'BO',
  'Brunei Darussalam': 'BN',
  "Cote d'Ivoire": 'CI',
  Korea: 'KR',
  'Viet Nam': 'VN',
};

const SUPPORTED_UNITS = ['Mtoe', 'ktoe'];

const ZEROS = range(1973, 2017).map(year => ({ year, value: 0 }));
const NULLS = range(1973, 2017).map(year => ({ year, value: null }));

const statisticCodeMap = {
  NUCLEAR_CONSUMPTION_MTOE: '118',
  HYDRO_CONSUMPTION_MTOE: '115',
};

let allHeaders = {};
function addHeaders(headers) {
  allHeaders = {
    ...allHeaders,
    ...indexBy(h => h.code, headers),
  };
}

function parseBalanceFile(string) {
  const lines = string.split('\r\n');
  lines.pop(); // remove last empty line

  const arrays = lines.map(line => line.split('\t'));
  const units = arrays[3].slice(3);
  const years = arrays[5].slice(3);

  const statisticData = arrays.slice(7);
  const statisticHeaders = statisticData
    .map(s => s.slice(1, 3))
    .map(s => ({
      code: s[0],
      name: s[1],
    }));
  addHeaders(statisticHeaders);

  const statisticValues = statisticData.map(s =>
    s
      .slice(3)
      .map((v, j) => ({
        year: Number(years[j]),
        unit: units[j],
        value: Number(v),
      }))
      .filter(v => SUPPORTED_UNITS.includes(v.unit))
      .map(v =>
        v.unit === 'ktoe'
          ? { year: v.year, value: v.value / 1000 }
          : { year: v.year, value: v.value },
      ),
  );

  const statistics = statisticHeaders.map((header, i) => ({
    ...header,
    values: statisticValues[i],
  }));

  return indexBy(s => s.code, statistics);
}

async function getBalanceData(file) {
  const res = await retryFetch(`https://www.iea.org/sankey/${file}`);
  const data = await res.text();
  const countryStatistics = parseBalanceFile(data);

  return countryStatistics;
}

async function getSourceByCountry() {
  const res = await retryFetch(`https://www.iea.org/sankey/config.xml`);
  const data = await res.text();
  const object = convert.xml2js(data, { compact: true });

  const sourcefileByCountry = object.config.dataSources.source.reduce(
    (map, element) => {
      const country = countries.find(c => {
        // eslint-disable-next-line no-underscore-dangle
        const { name } = element._attributes;
        return (
          c.name.common === name ||
          c.name.official === name ||
          OTHER_MAP[name] === c.cca2
        );
      });

      if (!country) {
        // eslint-disable-next-line no-underscore-dangle
        // console.log(element._attributes.name);
        return map;
      }

      const sourceFile = element.file.find(
        // eslint-disable-next-line no-underscore-dangle
        f => f._attributes.name === 'Balance',
      );

      return {
        ...map,
        // eslint-disable-next-line no-underscore-dangle
        [country.cca2]: sourceFile._attributes.src,
      };
    },
    {},
  );
  return sourcefileByCountry;
}
const memoizedGetSourceByCountry = memoizeWith(i => i, getSourceByCountry);

async function getCountryBalanceData(countryCode) {
  const sourcefileByCountry = await memoizedGetSourceByCountry();
  const sourceFile = sourcefileByCountry[countryCode];

  if (!sourceFile) {
    return null;
  }

  return getBalanceData(sourceFile);
}
const memoizedGetCountryBalanceData = memoizeWith(
  i => i,
  getCountryBalanceData,
);

async function fetchCountryStatisticFromIEASankey(statisticCode, country) {
  const balanceData = await memoizedGetCountryBalanceData(country.alpha2Code);

  if (!balanceData) {
    return NULLS;
  }
  const statistic = balanceData[statisticCodeMap[statisticCode]];

  if (!statistic) {
    return ZEROS;
  }

  return statistic.values;
}

// (async function test() {
//   await Promise.all(
//     countries.map(country =>
//       fetchCountryStatisticFromIEASankey('NUCLEAR_CONSUMPTION_MTOE', {
//         alpha2Code: country.cca2,
//       }),
//     ),
//   );
//   require('fs').writeFileSync(
//     'headers.json',
//     JSON.stringify(allHeaders, null, 2),
//   );
// })();

// getCountryBalanceData('SA')
//   .then(res => res[117].values)
//   .then(res => console.log(res))
//   .catch(err => console.log(err));

module.exports = {
  apiCode: IEA_SANKEY_API,
  fetchCountryStatistic: fetchCountryStatisticFromIEASankey,
  sourceAttribution: 'IEA',
};
