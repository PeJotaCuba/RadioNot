async function test() {
  const res = await fetch('https://raw.githubusercontent.com/PeJotaCuba/Bases-de-datos-CMNL/refs/heads/almacen/radionot.json');
  console.log(res.status, res.statusText);
  const text = await res.text();
  console.log('Text:', text);
}
test();
