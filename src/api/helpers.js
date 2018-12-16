// eslint-disable-next-line import/prefer-default-export
export function fetchJSON(url, options) {
  return fetch(url, options).then(res => res.json());
}
