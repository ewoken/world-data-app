const fetch = require('node-fetch');

function retryFetch(url, options, retryCount = 0) {
  return fetch(url, options)
    .then(res => res.json())
    .catch(error => {
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

module.exports = {
  retryFetch,
};
