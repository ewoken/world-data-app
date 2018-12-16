// eslint-disable-next-line camelcase
function convert_TWh_to_Mtoe(twh) {
  return twh / 11.63;
}

function generationToConsumption(value) {
  return value / 0.38;
}

module.exports = {
  convert_TWh_to_Mtoe,
  generationToConsumption,
};
