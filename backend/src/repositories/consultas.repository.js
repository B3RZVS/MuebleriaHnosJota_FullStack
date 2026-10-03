import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const archivoConsultas = fileURLToPath(new URL('../data/consultas.json', import.meta.url));
let colaDeEscrituras = Promise.resolve();

const guardar = (consulta) => {
  const escritura = colaDeEscrituras.then(async () => {
    let consultas;
    try {
      consultas = JSON.parse(await readFile(archivoConsultas, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      consultas = [];
      await writeFile(archivoConsultas, '[]\n');
    }
    consultas.push({ ...consulta, fecha: new Date().toISOString() });
    await writeFile(archivoConsultas, `${JSON.stringify(consultas, null, 2)}\n`);
  });

  colaDeEscrituras = escritura.catch(() => {});
  return escritura;
};

export default { guardar };