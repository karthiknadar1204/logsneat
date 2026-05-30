import type { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { projects, spans, traces } from '../config/schema';
import { parseOtlp, summarizeTraces } from '../lib/otlp';

export async function ingestTraces(c: Context) {
  const projectId = c.req.header('x-project-id');
  if (!projectId) {
    return c.json({ error: 'x-project-id header is required' }, 400);
  }

  const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project) {
    return c.json({ error: 'Project not found' }, 404);
  }

  const body = await c.req.json();
  const spanRows = parseOtlp(body, projectId);
  if (spanRows.length === 0) return c.json({}, 200);

  await db.insert(spans).values(spanRows);
  await db.insert(traces).values(summarizeTraces(spanRows, projectId));

  return c.json({}, 200);
}
