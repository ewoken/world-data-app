import regression from 'regression';

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

const CO2_INTENSITY_BY_SOURCE = {
  coal: 820,
  oil: 650,
  gas: 490,
  biomass: 230,
  solar: 45,
  geoth: 38,
  hydro: 24,
  nuclear: 12,
  wind: 11,
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
    scale: 'linear',
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
  {
    code: 'FOSSIL_RENTS_IN_GDP',
    name: 'Fossil rents',
    description: 'Share of all fossil rents (coal, oil & gas) in GDP',
    unit: PERCENTAGE_UNIT,
    source: {
      coal: 'COAL_RENTS_IN_GDP',
      oil: 'OIL_RENTS_IN_GDP',
      gas: 'GAS_RENTS_IN_GDP',
    },
    startingYear: 1973,
    endingYear: 2016,
    isIntensive: true,
    sourceAttribution: 'World Bank',
    category: 'Others',
    compute({ coal, gas, oil }) {
      return coal * gas * oil;
    },
  },
  {
    code: 'OIL_RELATIVE_PRICE',
    name: 'Oil relative price',
    description: `Average time (in days) that an inhabitant need to work to buy a barrel of crude oil.
TIME = OIL_PRICE / (GDP / POP)`,
    unit: {
      main: 'days',
      base: 'days',
    },
    source: {
      oilPrice: 'OIL_PRICE_USD',
      gdp: 'GDP_USD',
      pop: 'POPULATION',
    },
    startingYear: 1973,
    endingYear: 2016,
    isIntensive: true,
    category: 'Others',
    compute({ oilPrice, gdp, pop }) {
      return (oilPrice / ((gdp * 10 ** 9) / (pop * 10 ** 6))) * 365.25;
    },
  },
  {
    code: 'WIND_CAPACITY_POWER_LOAD',
    name: 'Wind capacity power load',
    description: `Average power load of wind capacity on a year (estimate)`,
    unit: PERCENTAGE_UNIT,
    source: {
      capacity: 'WIND_CAPACITY_GW',
      generation: 'WIND_GENERATION_TWH',
    },
    startingYear: 1973,
    endingYear: 2016,
    isIntensive: true,
    isCompilation: true,
    category: 'Electricity',
    scale: 'linear',
    compute(_, data) {
      const notNullData = data.filter(d => d.generation && d.capacity);
      if (notNullData.length < 4) {
        return null;
      }

      const array = notNullData.map(({ capacity, generation }) => [
        capacity,
        generation,
      ]);
      const result = regression.linear(array);
      const res = ((result.equation[0] * 10 ** 3) / (365.25 * 24)) * 100;
      const res2 = res > 100 || result.r2 < 0.9 ? null : res;

      return res2;
    },
  },
  {
    code: 'SOLAR_CAPACITY_POWER_LOAD',
    name: 'Solar capacity power load',
    description: `Average power load of solar capacity on a year (estimate)`,
    unit: PERCENTAGE_UNIT,
    source: {
      capacity: 'SOLAR_CAPACITY_GW',
      generation: 'SOLAR_GENERATION_TWH',
    },
    startingYear: 1973,
    endingYear: 2016,
    isIntensive: true,
    isCompilation: true,
    category: 'Electricity',
    compute(_, data) {
      const notNullData = data.filter(d => d.generation && d.capacity);
      if (notNullData.length < 4) {
        return null;
      }

      const array = notNullData.map(({ capacity, generation }) => [
        capacity,
        generation,
      ]);
      const result = regression.linear(array);
      const res = ((result.equation[0] * 10 ** 3) / (365.25 * 24)) * 100;
      const res2 = res > 50 || result.r2 < 0.9 ? null : res;

      return res2;
    },
  },
  {
    code: 'GHG_EMISSIONS_GKWH',
    name: 'Carbon intensity of electricity',
    description: `Average GHG emissions of electricity production.
Coal: 820 gCO₂eq/kWh
Oil: 650 gCO₂eq/kWh
Gas: 490 gCO₂eq/kWh
Biomass: 230 gCO₂eq/kWh
Solar: 45 gCO₂eq/kWh
Geoth: 38 gCO₂eq/kWh
Hydro: 24 gCO₂eq/kWh
Nuclear: 12 gCO₂eq/kWh
Wind: 11 gCO₂eq/kWh
`,
    unit: {
      main: 'gCO₂eq/kWh',
      base: 'gCO₂eq/kWh',
      factor: 1,
    },
    source: {
      coal: 'COAL_ELECTRICITY_GENERATION_TWH',
      oil: 'OIL_ELECTRICITY_GENERATION_TWH',
      gas: 'GAS_ELECTRICITY_GENERATION_TWH',
      biomass: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
      solar: 'SOLAR_GENERATION_TWH',
      renew: 'GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH',
      hydro: 'HYDRO_GENERATION_TWH',
      nuclear: 'NUCLEAR_GENERATION_TWH',
      wind: 'WIND_GENERATION_TWH',
    },
    startingYear: 1973,
    endingYear: 2016,
    isIntensive: true,
    category: 'Climate change',
    scale: 'linear',
    colorScheme: 'CO2',
    compute(sources) {
      const { year, wind, solar, renew, ...rest } = sources;
      const geoth = renew - wind - solar;
      const source2 = { ...rest, wind, solar, geoth };
      const total = Object.keys(source2).reduce(
        (sum, key) => sum + (source2[key] || 0),
        0,
      );
      const intensity = Object.keys(source2).reduce(
        (sum, key) => sum + (source2[key] || 0) * CO2_INTENSITY_BY_SOURCE[key],
        0,
      );

      return intensity / total;
    },
  },
];

export default derivedStatistics;
