// eslint-disable-next-line camelcase
export function convert_TWh_to_Mtoe(twh) {
  return twh / 11.63;
}

// eslint-disable-next-line camelcase
export function generationToConsumption(value) {
  return value / 0.38;
}
