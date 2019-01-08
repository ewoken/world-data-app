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
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/2020991907/0',
  },
  {
    code: 'COAL_CONSUMPTION_MTOE',
    name: 'Coal consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/2020991907/2',
  },
  {
    code: 'GAS_PRODUCTION_MTOE',
    name: 'Gas production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1165808390/0',
  },
  {
    code: 'GAS_CONSUMPTION_MTOE',
    name: 'Gas consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1165808390/1',
  },
  {
    code: 'OIL_PRODUCTION_MTOE',
    name: 'Oil production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/2020991907/2',
  },
  {
    code: 'OIL_CONSUMPTION_MTOE',
    name: 'Oil consumption',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1920537974/1',
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
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1002896040/0',
  },
  {
    code: 'POPULATION',
    name: 'Population',
    description: '',
    unit: CAPITA,
    source: worldBankAPI.apiCode,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.POP.TOTL',
  },
  {
    code: 'GDP_2010_USD',
    name: 'Gross Domestic Product',
    description: '',
    unit: BILLION_2010_USD,
    source: worldBankAPI.apiCode,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD',
  },
  {
    code: 'FOSSIL_CO2_EMISSIONS_MT',
    name: 'CO2 Emissions from fossil fuels',
    description: '',
    unit: MT,
    source: ieaAPI.apiCode,
    category: 'Climate change',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/1378539487/0',
  },
  {
    code: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    name: 'Primary energy production',
    description: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Productions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1002896040/0',
  },
  {
    code: 'ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation',
    descrition: '',
    unit: TWH,
    source: ieaAPI.apiCode,
    category: 'Electricity',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1118783123/0',
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
  {
    code: 'FINAL_ENERGY_CONSUMPTION_MTOE',
    name: 'Final energy consumption',
    descrition: '',
    unit: MTOE_UNIT,
    source: ieaAPI.apiCode,
    category: 'Consumptions',
  },
];

module.exports = statistics;
