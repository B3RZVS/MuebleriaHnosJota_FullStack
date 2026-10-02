import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const archivoConsultas = fileURLToPath(new URL('../data/consultas.json', import.meta.url));
let colaDeEscrituras = Promise.resolve();

const guardar = (consulta) => {
  const escritura = colaDeEscrituras.then(async () => {
    const consultas = JSON.parse(await readFile(archivoConsultas, 'utf8'));
    consultas.push({ ...consulta, fecha: new Date().toISOString() });
    await writeFile(archivoConsultas, `${JSON.stringify(consultas, null, 2)}\n`);
  });

  colaDeEscrituras = escritura.catch(() => {});
  return escritura;
};

export default { guardar };