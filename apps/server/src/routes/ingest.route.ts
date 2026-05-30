import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { ingestTraces } from '../controllers/ingest.controller';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export const ingestRoutes = new Hono();

ingestRoutes.use('/v1/traces', jwt({ secret: JWT_SECRET, alg: 'HS256' }));
ingestRoutes.post('/v1/traces', ingestTraces);
