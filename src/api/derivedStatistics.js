const PERCENTAGE_UNIT = {
  main: '%',
  base: '%',
  factor: 1,
};

const MTOE_UNIT = {
  main: 'Mtoe',
  base: 'toe',
  factor: 10 ** 6,
};

const TWH_UNIT = {
  main: 'TWh',
  base: 'kWh',
  factor: 10 ** 9,
};

const ENERGY_INTENSITY_UNIT = {
  main: 'toe/million 2010 $',
  base: 'toe/million 2010 $',
  factor: 1,
};

const CO2_INTENSITY_OF_ENERGY_UNIT = {
  main: 'tCO2/toe',
  base: 'tCO2/toe',
  factor: 1,
};

// TODO factorize with dataSources
const MTOE_TO_TWH = 11.63;
const POWER_PLANT_EFFICIENCIES = {
  NUCLEAR: 0.33,
  HYDRO: 1, // definition of statistics
};

const derivedStatistics = [
  {
    code: 'ENERGY_SELF_SUFFICIENCY',
    name: 'Energy Self-sufficiency',
    description:
      'This indicator made up by dividing primary energy consumption by primary energy production, gives an indication on the level of self-sufficiency (or dependency) of a country.',
    unit: PERCENTAGE_UNIT,
    source: {
      consumption: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
      production: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    category: 'Others',
    isIntensive: true,
    compute({ consumption, production }) {
      return (production / consumption) * 100;
    },
  },
  {
    code: 'ENERGY_INTENSITY',
    name: 'Energy Intensity',
    description: '',
    unit: ENERGY_INTENSITY_UNIT,
    source: {
      energy: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
      gdp: 'GDP_2010_USD',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA, World Bank',
    category: 'Climate change',
    isIntensive: true,
    compute({ energy, gdp }) {
      return (energy / gdp) * 10 ** 3;
    },
  },
  {
    code: 'CO2_INTENSITY_OF_ENERGY',
    name: 'CO2 Intensity of energy',
    description:
      'Measures the mass of CO2 by unit of energy that is emitted by the country.',
    unit: CO2_INTENSITY_OF_ENERGY_UNIT,
    source: {
      co2: 'FOSSIL_CO2_EMISSIONS_MT',
      energy: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA, World Bank',
    category: 'Climate change',
    isIntensive: true,
    compute({ energy, co2 }) {
      return co2 / energy;
    },
  },
  {
    code: 'RENEWABLES_PRODUCTION_MTOE',
    name: 'Renewables production',
    description: 'Includes hydroelectricity, solar, wind and tide productions.',
    unit: MTOE_UNIT,
    source: {
      hydro: 'HYDRO_PRODUCTION_MTOE',
      geothSolarWindTide: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    category: 'Productions',
    compute({ hydro, geothSolarWindTide }) {
      return hydro + geothSolarWindTide;
    },
  },
  {
    code: 'LOW_CARBON_ENERGY_PRODUCTION_MTOE',
    name: 'Low-carbon energy production',
    description:
      'Includes renewables and nuclear productions. Excludes biofuels at the moment.',
    unit: MTOE_UNIT,
    source: {
      hydro: 'HYDRO_PRODUCTION_MTOE',
      geothSolarWindTide: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
      nuclear: 'NUCLEAR_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    category: 'Productions',
    compute({ hydro, geothSolarWindTide, nuclear }) {
      return hydro + geothSolarWindTide + nuclear;
    },
  },
  {
    code: 'NUCLEAR_GENERATION_TWH',
    name: 'Electricity generation from nuclear',
    description: '',
    unit: TWH_UNIT,
    source: {
      nuclear: 'NUCLEAR_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    category: 'Electricity',
    compute({ nuclear }) {
      return nuclear * POWER_PLANT_EFFICIENCIES.NUCLEAR * MTOE_TO_TWH;
    },
  },
  {
    code: 'HYDRO_GENERATION_TWH',
    name: 'Electricity generation from hydro',
    description: '',
    unit: TWH_UNIT,
    source: {
      hydro: 'HYDRO_PRODUCTION_MTOE',
    },
    startingYear: 1973,
    endingYear: 2016,
    sourceAttribution: 'IEA',
    category: 'Electricity',
    compute({ hydro }) {
      return hydro * POWER_PLANT_EFFICIENCIES.HYDRO * MTOE_TO_TWH;
    },
  },
];

export default derivedStatistics;
