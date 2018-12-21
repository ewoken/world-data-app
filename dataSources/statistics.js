// const eiaAPI = require('./api/eia');
const ieaAPI = require('./api/iea');
const worldBankAPI = require('./api/worldBank');
const ieaSankey = require('./api/ieaSankey');

const MTOE_UNIT = {
  main: 'Mtoe',
  base: 'toe',
  factor: 10 ** 6,
};

const CAPITA = {
  main: 'million people',
  base: 'people',
  factor: 10 ** 6,
};

const BILLION_2010_USD = {
  main: 'billion 2010 USD',
  base: '2010 $',
  factor: 10 ** 9,
};

const MT = {
  main: 'Mt',
  base: 't',
  factor: 10 ** 6,
};

const TWH = {
  main: 'TWh',
  base: 'kWh',
  factor: 10 ** 9,
};

const statistics = [
  {
    code: 'COAL_PRODUCTION_MTOE',
    name: 'Coal production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'COAL_CONSUMPTION_MTOE',
    name: 'Coal consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'GAS_PRODUCTION_MTOE',
    name: 'Gas production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'GAS_CONSUMPTION_MTOE',
    name: 'Gas consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'OIL_PRODUCTION_MTOE',
    name: 'Oil production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'OIL_CONSUMPTION_MTOE',
    name: 'Oil consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'HYDRO_PRODUCTION_MTOE',
    name: 'Hydroelectricity production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
  },
  {
    code: 'NUCLEAR_PRODUCTION_MTOE',
    name: 'Nuclear production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
  },
  {
    code: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
    name: 'Biofuels & waste consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
    name: 'Geothermal, solar, wind, tide, energy production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
  },
  {
    code: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
    name: 'Primary energy consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'POPULATION',
    name: 'Population',
    description: '',
    unit: CAPITA,
    source: worldBankAPI.apiCode,
  },
  {
    code: 'GDP_2010_USD',
    name: 'Gross Domestic Product',
    description: '',
    unit: BILLION_2010_USD,
    source: worldBankAPI.apiCode,
  },
  {
    code: 'CO2_EMISSIONS_MT',
    name: 'CO2 Emissions',
    description: '',
    unit: MT,
    source: worldBankAPI.apiCode,
  },
  {
    code: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    name: 'Primary energy production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
  },
  {
    code: 'ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation',
    descrition: '',
    unit: TWH,
    source: ieaAPI.apiCode,
  },
  {
    code: 'OIL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity consumption from oil',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
  },
  {
    code: 'GAS_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity consumption from gas',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
  },
  {
    code: 'COAL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity consumption from coal',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
  },
  {
    code: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity consumption from biofuels & waste',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity consumption from wind, solar, geothermal and tide',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
  },
];

module.exports = statistics;
