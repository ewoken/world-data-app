const GENERATION_TO_CONSUMPTION_FACTOR = 0.38;
const MTOE_TO_TWH = 11.63;
const TWH_TO_MTOE = 1 / MTOE_TO_TWH;

// TODO sources or regression
const POWER_PLANT_EFFICIENCIES = {
  OIL: 0.35,
  GAS: 0.45,
  COAL: 0.33,
  NUCLEAR: 0.33,
  HYDRO: 1, // definition of statistics
  SOLAR: 1, // same here
  GEOTHERMY: 0.1,
  BIOFUELS_WASTE: 0.33,
};

module.exports = {
  GENERATION_TO_CONSUMPTION_FACTOR,
  MTOE_TO_TWH,
  POWER_PLANT_EFFICIENCIES,
  TWH_TO_MTOE,
};
