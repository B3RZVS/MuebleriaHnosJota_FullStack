import { randomBytes } from 'node:crypto';
import session from 'express-session';

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('La variable SESSION_SECRET es obligatoria en producción');
}

const secret =
  process.env.SESSION_SECRET || randomBytes(32).toString('hex');

const sessionMiddleware = session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export default sessionMiddleware;
