// Igual que SESSION_SECRET: si falta, el server no arranca y evitamos un 500 en el login
if (!process.env.JWT_SECRET) {
  throw new Error('La variable JWT_SECRET es obligatoria');
}

const jwtSecretMiddleware = (req, res, next) => {
  next();
};

export default jwtSecretMiddleware;
