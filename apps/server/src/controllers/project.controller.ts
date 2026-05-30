import type { Context } from 'hono';
import { db } from '../config/db';
import { projects } from '../config/schema';

export async function createProject(c: Context) {
  const { name } = await c.req.json();

  if (!name || typeof name !== 'string') {
    return c.json({ error: 'Project name is required' }, 400);
  }

  const [project] = await db
    .insert(projects)
    .values({ name })
    .returning({ id: projects.id, name: projects.name });

  return c.json({ project }, 201);
}
