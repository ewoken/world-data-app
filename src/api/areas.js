export default async function getAreas() {
  const res = await fetch(`${process.env.PUBLIC_URL}/data/areas.json`);
  const data = await res.json();

  return data.map(area => ({
    ...area,
    alpha2Code: area.code,
    commonName: area.name,
  }));
}
