async function getAllCountries() {
  const [countries, worldTopo] = await Promise.all(
    [
      fetch(`${process.env.PUBLIC_URL}/data/countries.json`),
      fetch(`${process.env.PUBLIC_URL}/data/worldTopo.json`),
    ].map(p => p.then(res => res.json())),
  );
  return {
    countries,
    worldTopo,
  };
}

export default getAllCountries;
