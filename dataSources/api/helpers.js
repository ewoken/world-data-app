const fetch = require('node-fetch');

function retryFetch(url, options, retryCount = 0) {
  return fetch(url, options).catch(error => {
    if (retryCount > 3) {
      throw error;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Retry ${url}`);
        retryFetch(url, options, retryCount + 1)
          .then(resolve)
          .catch(reject);
      }, 3000);
    });
  });
}

function parseCSV(string) {
  const lines = string.split('\r\n');
  lines.pop(); // remove last empty line

  const headers = lines
    .shift()
    .split(',')
    .map(header => header.replace(/"/g, ''));

  const data = lines.map(l => {
    const array = l.match(/(?<=^|,)("(?:[^"]|"")*"|[^,]*)/g);
    return array.reduce((object, cell, i) => {
      // eslint-disable-next-line no-param-reassign
      object[headers[i]] = cell.replace(/"/g, '');
      return object;
    }, {});
  });
  return data;
}

module.exports = {
  retryFetch,
  parseCSV,
};
