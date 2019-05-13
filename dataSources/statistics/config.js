const sources = require('./sources');

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
  base: '$ (2010)',
  factor: 10 ** 9,
};

const MT = {
  main: 'Mt',
  base: 't',
  factor: 10 ** 6,
};

const GT = {
  main: 'Gt',
  base: 'kt',
  factor: 10 ** 6,
};

const TWH = {
  main: 'TWh',
  base: 'kWh',
  factor: 10 ** 9,
};

const BILLION_BARRELS = {
  main: 'billion barrels',
  base: 'barrels',
  factor: 10 ** 6,
};

const BILLION_CUBIC_METERS = {
  main: 'billion m3',
  base: 'm3',
  factor: 10 ** 9,
};

const PERCENTAGE = {
  main: '%',
  base: '%',
  factor: 1,
};

const statistics = [
  {
    code: 'COAL_PRODUCTION_MTOE',
    name: 'Coal production',
    description: '',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#coalandpeat',
  },
  {
    code: 'COAL_CONSUMPTION_MTOE',
    name: 'Coal consumption',
    description: '',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Consumptions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#coalandpeat',
  },
  {
    code: 'GAS_PRODUCTION_MTOE',
    name: 'Gas production',
    description: `Dry marketable natural gas production within national boundaries, including offshore production and is measured after purification and extraction of NGL and sulphur.
Includes gas consumed by gas processing plants and gas transported by pipeline.
Excludes quantities of gas that are re-injected, vented or flared.`,
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#naturalgas',
  },
  {
    code: 'GAS_CONSUMPTION_MTOE',
    name: 'Gas consumption',
    description: '',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Consumptions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#naturalgas',
  },
  {
    code: 'OIL_PRODUCTION_MTOE',
    name: 'Oil production',
    description: '',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#crudeoil',
  },
  {
    code: 'OIL_CONSUMPTION_MTOE',
    name: 'Oil consumption',
    description: '',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Consumptions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#crudeoil',
  },
  {
    code: 'HYDRO_PRODUCTION_MTOE',
    name: 'Hydroelectricity production',
    description: `Hydro shows the energy content of the electricity produced in hydro power plants.
Excludes output from pumped storage plants.`,
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#hydro',
  },
  {
    code: 'NUCLEAR_PRODUCTION_MTOE',
    name: 'Nuclear production',
    description:
      'Nuclear shows the primary heat equivalent of the electricity produced by a nuclear power plant with an average thermal efficiency of 33 per cent.',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#nuclear',
  },
  {
    code: 'BIOFUELS_WASTE_PRODUCTION_MTOE',
    name: 'Biofuels & waste production',
    description:
      'Biofuels & waste is comprised of solid biofuels, liquid biofuels, biogases, industrial waste and municipal waste.',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#biofuelsandwaste',
  },
  {
    code: 'BIOFUELS_WASTE_CONSUMPTION_MTOE',
    name: 'Biofuels & waste consumption',
    description:
      'Biofuels & waste is comprised of solid biofuels, liquid biofuels, biogases, industrial waste and municipal waste.',
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Consumptions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#biofuelsandwaste',
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_PRODUCTION_MTOE',
    name: 'Geothermal, solar, wind, tide, energy production',
    description: `Geothermal, solar, etc. shows production of geothermal, solar, wind and tide/wave/ocean energy and the use of these energy forms for electricity and heat generation.
The quantity of geothermal energy entering electricity generation is inferred from the electricity production at geothermal plants assuming an average thermal efficiency of 10%.
For others, the quantities entering electricity generation are equal to the electrical energy generated.`,
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#geothermalsolaretc',
  },
  {
    code: 'PRIMARY_ENERGY_CONSUMPTION_MTOE',
    name: 'Primary energy consumption',
    description: `Total consumption of energy sources contained in the environment, such as raw fuels or renewables sources of energy.
Also known as 'total primary energy supply', is made up of: primary energy production + imports - exports - international marine/aviation bunkers +/- stock changes`,
    unit: MTOE_UNIT,
    source: sources.iea.id,
    category: 'Consumptions',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/-1002896040/0',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/',
  },
  {
    code: 'POPULATION',
    name: 'Population',
    description: '',
    unit: CAPITA,
    source: sources.worldBank.id,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.POP.TOTL',
    sourceDescriptionUrl:
      'https://databank.worldbank.org/data/reports.aspx?source=2&type=metadata&series=SP.POP.TOTL',
  },
  {
    code: 'GDP_2010_USD',
    name: 'Gross Domestic Product',
    description: `GDP at purchaser's prices is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products.
Data are in constant 2010 U.S. dollars.
Dollar figures for GDP are converted from domestic currencies using 2010 official exchange rates.`,
    unit: BILLION_2010_USD,
    source: sources.worldBank.id,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD',
    sourceDescriptionUrl:
      'https://databank.worldbank.org/data/reports.aspx?source=2&type=metadata&series=NY.GDP.MKTP.KD',
  },
  {
    code: 'COAL_RENTS_IN_GDP',
    name: 'Coal rents',
    description: `Coal rents are the difference between the value of crude oil production at world prices and total costs of production.`,
    unit: PERCENTAGE,
    source: sources.worldBank.id,
    isIntensive: true,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.COAL.RT.ZS',
    sourceDescriptionUrl:
      'https://databank.worldbank.org/data/reports.aspx?source=2&type=metadata&series=NY.GDP.COAL.RT.ZS',
  },
  {
    code: 'OIL_RENTS_IN_GDP',
    name: 'Oil rents',
    description: `Oil rents are the difference between the value of crude oil production at world prices and total costs of production.`,
    unit: PERCENTAGE,
    source: sources.worldBank.id,
    isIntensive: true,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PETR.RT.ZS',
    sourceDescriptionUrl:
      'https://databank.worldbank.org/data/reports.aspx?source=2&type=metadata&series=NY.GDP.PETR.RT.ZS',
  },
  {
    code: 'GAS_RENTS_IN_GDP',
    name: 'Natural gas rents',
    description: `Natural gas rents are the difference between the value of crude oil production at world prices and total costs of production.`,
    unit: PERCENTAGE,
    source: sources.worldBank.id,
    isIntensive: true,
    category: 'Others',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.NGAS.RT.ZS',
    sourceDescriptionUrl:
      'https://databank.worldbank.org/data/reports.aspx?source=2&type=metadata&series=NY.GDP.NGAS.RT.ZS',
  },
  {
    code: 'FOSSIL_CO2_EMISSIONS_MT',
    name: 'CO2 Emissions from fossil fuels',
    description: `Carbon dioxide emissions are those stemming from the burning of fossil fuels.`,
    unit: MT,
    source: sources.iea.id,
    category: 'Climate change',
    sourceUrl: 'http://energyatlas.iea.org/#!/tellmap/1378539487/0',
    sourceDescriptionUrl: 'http://energyatlas.iea.org/#!/tellmap/1378539487/0',
  },
  {
    code: 'PRIMARY_ENERGY_PRODUCTION_MTOE',
    name: 'Primary energy production',
    description: `Total production of energy sources contained in the environment, such as raw fuels or renewables sources of energy.`,
    unit: MTOE_UNIT,
    source: sources.ieaSankey.id,
    category: 'Productions',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#iproduction',
  },
  {
    code: 'ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation',
    description:
      'Total electricity generation. Gap between this data and aggregation of generation by fuels is due to approximation in power plants efficiencies.',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
    sourceDescriptionUrl:
      'https://www.iea.org/statistics/resources/balancedefinitions/#electricity',
  },
  {
    code: 'OIL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from oil',
    description:
      'Inferred from inputs to plant stations assuming an efficiency of 35%.',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
  },
  {
    code: 'GAS_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from gas',
    description:
      'Inferred from inputs to plant stations assuming an efficiency of 45%.',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
  },
  {
    code: 'COAL_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from coal',
    description:
      'Inferred from inputs to plant stations assuming an efficiency of 33%.',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
  },
  {
    code: 'BIOFUELS_WASTE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from biofuels & waste',
    description:
      'Inferred from inputs to plant stations assuming an efficiency of 33%.',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
  },
  {
    code: 'GEOTH_SOLAR_WIND_TIDE_ELECTRICITY_GENERATION_TWH',
    name: 'Electricity generation from wind, solar, geothermal and tide',
    description: '',
    unit: TWH,
    source: sources.ieaSankey.id,
    category: 'Electricity',
  },
  {
    code: 'FINAL_ENERGY_CONSUMPTION_MTOE',
    name: 'Final energy consumption',
    description: `Final energy consumption is the total energy consumed by end users, such as households, industry and agriculture.
It is the energy which reaches the final consumer's door and excludes that which is used by the energy sector itself.`,
    unit: MTOE_UNIT,
    source: sources.iea.id,
    category: 'Consumptions',
  },
  {
    code: 'COAL_RESERVES_GT',
    name: 'Coal Reserves',
    description: '',
    unit: GT,
    source: sources.eia.id,
    category: 'Reserves',
  },
  {
    code: 'OIL_RESERVES_BB',
    name: 'Oil Reserves',
    description: '',
    unit: BILLION_BARRELS,
    source: sources.eia.id,
    category: 'Reserves',
  },
  {
    code: 'GAS_RESERVES_BCM',
    name: 'Gas Reserves',
    description: '',
    unit: BILLION_CUBIC_METERS,
    source: sources.eia.id,
    category: 'Reserves',
  },
  {
    code: 'HUMAN_DEVELOPMENT_INDEX',
    name: 'Human development index',
    description:
      'The HDI was created to emphasize that people and their capabilities should be the ultimate criteria for assessing the development of a country, not economic growth alone.',
    unit: {
      main: '',
      base: '',
      factor: 1,
    },
    source: sources.hdro.id,
    startingYear: 1990,
    isIntensive: true,
    category: 'Others',
    sourceUrl: 'http://hdr.undp.org/en/data',
    sourceDescriptionUrl:
      'http://hdr.undp.org/en/content/human-development-index-hdi',
  },
  {
    code: 'INEQUALITY_ADJUSTED_HDI',
    name: 'Inequality-adjusted Human Development Index',
    description:
      'The IHDI combines a country’s average achievements in health, education and income with how those achievements are distributed among country’s population by “discounting” each dimension’s average value according to its level of inequality.',
    unit: {
      main: '',
      base: '',
      factor: 1,
    },
    source: sources.hdro.id,
    startingYear: 1990,
    isIntensive: true,
    category: 'Others',
    sourceUrl: 'http://hdr.undp.org/en/composite/IHDI',
    sourceDescriptionUrl:
      'http://hdr.undp.org/en/content/inequality-adjusted-human-development-index-ihdi',
  },
];

module.exports = statistics;
