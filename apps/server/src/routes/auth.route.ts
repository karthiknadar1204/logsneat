import { Hono } from 'hono';
import { signup, login } from '../controllers/auth.controller';

export const authRoutes = new Hono();

authRoutes.post('/auth/signup', signup);
authRoutes.post('/auth/login', login);
