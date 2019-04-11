const { indexBy } = require('ramda');
const countries = require('world-countries/countries');
const convert = require('xml-js');

const { retryFetch } = require('../helpers');

let allHeaders = {};
function addHeaders(headers) {
  allHeaders = {
    ...allHeaders,
    ...indexBy(h => h.code, headers),
  };
}

const SUPPORTED_UNITS = ['Mtoe', 'ktoe'];

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

  const statistics = statisticHeaders
    .map((header, i) => ({
      ...header,
      values: statisticValues[i],
    }))
    .filter(s => !s.name.startsWith('Heat')); // TODO

  return indexBy(s => s.code, statistics);
}

const OTHER_MAP = {
  'Plurinational state of Bolivia': 'BO',
  'Brunei Darussalam': 'BN',
  "Cote d'Ivoire": 'CI',
  Korea: 'KR',
  'Viet Nam': 'VN',
};
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
    {
      SU: 'data/Former Soviet Union.SBBSBSBSBSBSBSSS_YY.txt',
    },
  );
  return sourcefileByCountry;
}

module.exports = {
  parseBalanceFile,
  getSourceByCountry,
};
