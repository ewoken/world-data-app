// eslint-disable-next-line
export function tickFormatter(value) {
  return value > 10 ** 7 ? value.toPrecision(2) : value.toLocaleString();
}
