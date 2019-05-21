async function getAllCountries() {
  const [countries, worldTopo] = await Promise.all(
    [fetch('/data/countries.json'), fetch('/data/worldTopo.json')].map(p =>
      p.then(res => res.json()),
    ),
  );
  return {
    countries,
    worldTopo,
  };
}

export default getAllCountries;
