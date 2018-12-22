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
    category: 'Productions',
  },
  {
    code: 'COAL_CONSUMPTION_MTOE',
    name: 'Coal consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
  },
  {
    code: 'GAS_PRODUCTION_MTOE',
    name: 'Gas production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
  },
  {
    code: 'GAS_CONSUMPTION_MTOE',
    name: 'Gas consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
  },
  {
    code: 'OIL_PRODUCTION_MTOE',
    name: 'Oil production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
  },
  {
    code: 'OIL_CONSUMPTION_MTOE',
    name: 'Oil consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
  },
  {
    code: 'HYDRO_PRODUCTION_MTOE',
    name: 'Hydroelectricity production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
    category: 'Productions',
  },
  {
    code: 'NUCLEAR_PRODUCTION_MTOE',
    name: 'Nuclear production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
    category: 'Productions',
  },
  {
    code: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
    name: 'Biofuels & waste consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
    category: 'Consumptions',
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
    name: 'Geothermal, solar, wind, tide, energy production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaSankey.apiCode,
    category: 'Productions',
  },
  {
    code: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
    name: 'Primary energy consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
  },
  {
    code: 'POPULATION',
    name: 'Population',
    description: '',
    unit: CAPITA,
    source: worldBankAPI.apiCode,
    category: 'Others',
  },
  {
    code: 'GDP_2010_USD',
    name: 'Gross Domestic Product',
    description: '',
    unit: BILLION_2010_USD,
    source: worldBankAPI.apiCode,
    category: 'Others',
  },
  {
    code: 'CO2_EMISSIONS_MT',
    name: 'CO2 Emissions',
    description: '',
    unit: MT,
    source: worldBankAPI.apiCode,
    category: 'Climate change',
  },
  {
    code: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    name: 'Primary energy production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
  },
  {
    code: 'ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation',
    descrition: '',
    unit: TWH,
    source: ieaAPI.apiCode,
    category: 'Electricity',
  },
  {
    code: 'OIL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from oil',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
    category: 'Electricity',
  },
  {
    code: 'GAS_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from gas',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
    category: 'Electricity',
  },
  {
    code: 'COAL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from coal',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
    category: 'Electricity',
  },
  {
    code: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from biofuels & waste',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
    category: 'Electricity',
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from wind, solar, geothermal and tide',
    descrition: '',
    unit: TWH,
    source: ieaSankey.apiCode,
    category: 'Electricity',
  },
];

module.exports = statistics;
