import { randomBytes } from 'node:crypto';
import session from 'express-session';

const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.SESSION_SECRET) {
  throw new Error('La variable SESSION_SECRET es obligatoria en producción');
}

const secret =
  process.env.SESSION_SECRET || randomBytes(32).toString('hex');

const sessionMiddleware = session({
  secret,
  resave: false,
  saveUninitialized: false,
  // Render atiende el HTTPS antes de llegar al server: sin esto no se crea la cookie "secure"
  proxy: true,
  cookie: {
    httpOnly: true,
    // En producción el client y la API están en dominios distintos: con 'lax' el navegador no manda la cookie
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export default sessionMiddleware;
