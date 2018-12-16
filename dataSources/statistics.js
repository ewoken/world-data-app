const { EIA_API } = require('./api/eia');
const { IEA_API } = require('./api/iea');
const { WORLD_BANK_API } = require('./api/worldBank');

const MTOE_UNIT = {
  main: 'Mtoe',
  base: 'toe',
  factor: 10 ** 6,
};

const CAPITA = {
  main: 'capita',
  base: 'capita',
  factor: 1,
};

const MILLION_2010_USD = {
  main: 'million 2010 USD',
  base: '2010 $',
  factor: 10 ** 6,
};

const MT = {
  main: 'Mt',
  base: 't',
  factor: 10 ** 6,
};

const statistics = [
  {
    code: 'COAL_PRODUCTION_MTOE',
    name: 'Coal production',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'COAL_CONSUMPTION_MTOE',
    name: 'Coal consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'GAS_PRODUCTION_MTOE',
    name: 'Gas production',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'GAS_CONSUMPTION_MTOE',
    name: 'Gas consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'OIL_PRODUCTION_MTOE',
    name: 'Oil production',
    description: '',
    unit: MTOE_UNIT,
    source: IEA_API,
  },
  {
    code: 'OIL_CONSUMPTION_MTOE',
    name: 'Oil consumption',
    description: '',
    unit: MTOE_UNIT,
    source: IEA_API,
  },
  {
    code: 'HYDRO_CONSUMPTION_MTOE',
    name: 'Hydroelectricity consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'NUCLEAR_CONSUMPTION_MTOE',
    name: 'Nuclear consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'NON_HYDRO_RENEWABLES_CONSUMPTION_MTOE',
    name: 'Non-Hydroelectric renewables consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'PRIMARY_ENERGY_MTOE',
    name: 'Primary energy consumption',
    description: '',
    unit: MTOE_UNIT,
    source: EIA_API,
  },
  {
    code: 'POPULATION',
    name: 'Population',
    description: '',
    unit: CAPITA,
    source: WORLD_BANK_API,
  },
  {
    code: 'GDP_2010_USD',
    name: 'Gross Domestic Product',
    description: '',
    unit: MILLION_2010_USD,
    source: WORLD_BANK_API,
  },
  {
    code: 'CO2_EMISSIONS_GT',
    name: 'CO2 Emissions',
    description: '',
    unit: MT,
    source: WORLD_BANK_API,
  },
];

module.exports = statistics;
