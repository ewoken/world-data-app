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

const derivedStatistics = [
  {
    code: 'ENERGY_SELF_SUFFICIENCY',
    name: 'Energy Self-sufficiency',
    description: '',
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
    description: '',
    unit: CO2_INTENSITY_OF_ENERGY_UNIT,
    source: {
      co2: 'CO2_EMISSIONS_MT',
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
    description: '',
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
    description: '',
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
];

export default derivedStatistics;
