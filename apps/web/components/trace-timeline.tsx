'use client';

import type { SpanNode } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Flat = { node: SpanNode; depth: number };

function flatten(nodes: SpanNode[], depth = 0, acc: Flat[] = []): Flat[] {
  for (const n of nodes) {
    acc.push({ node: n, depth });
    flatten(n.children, depth + 1, acc);
  }
  return acc;
}

// A gantt-style view: every span placed on a shared time axis (aligned to the
// trace start). Sequential spans sit end-to-end; parallel spans overlap; gaps
// are real idle time.
export function TraceTimeline({ spans }: { spans: SpanNode[] }) {
  const flat = flatten(spans).sort(
    (a, b) => new Date(a.node.startTime).getTime() - new Date(b.node.startTime).getTime(),
  );
  if (!flat.length) return null;

  const t0 = Math.min(...flat.map((f) => new Date(f.node.startTime).getTime()));
  const t1 = Math.max(...flat.map((f) => new Date(f.node.endTime).getTime()));
  const total = Math.max(t1 - t0, 1);

  return (
    <div className="overflow-hidden rounded-md border">
      {flat.map(({ node }) => {
        const s = new Date(node.startTime).getTime();
        const e = new Date(node.endTime).getTime();
        const left = ((s - t0) / total) * 100;
        const width = Math.max(((e - s) / total) * 100, 0.8);
        const error = node.statusCode === 2;
        return (
          <div key={node.spanId} className="flex items-center gap-3 border-b px-3 py-2 text-xs last:border-0">
            <div className="flex w-52 shrink-0 items-center gap-1.5">
              <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
                {node.kind ?? '—'}
              </Badge>
              <span className="truncate" title={node.name}>
                {node.name}
              </span>
            </div>
            <div className="relative h-4 flex-1 rounded bg-muted/40">
              <div
                className={cn('absolute top-0 h-4 rounded', error ? 'bg-red-500' : 'bg-primary')}
                style={{ left: `${left}%`, width: `${width}%`, minWidth: '2px' }}
                title={`${node.durationMs.toFixed(1)} ms`}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-muted-foreground">{node.durationMs.toFixed(0)} ms</span>
          </div>
        );
      })}
      <div className="px-3 py-1.5 text-right text-[10px] text-muted-foreground">total {total.toFixed(0)} ms</div>
    </div>
  );
}
