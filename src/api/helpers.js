// eslint-disable-next-line import/prefer-default-export
export function retryFetch(url, options, retryCount = 0) {
  return fetch(url, options).catch(error => {
    if (retryCount > 3) {
      throw error;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        retryFetch(url, options, retryCount + 1)
          .then(resolve)
          .catch(reject);
      }, 3000);
    });
  });
}
