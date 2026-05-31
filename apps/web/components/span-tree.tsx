'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { SpanNode } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function statusText(n: SpanNode) {
  if (n.statusCode === 2) return n.statusMessage ? `error — ${n.statusMessage}` : 'error';
  if (n.statusCode === 1) return 'ok';
  return 'unset';
}

function parseMaybeJson(v: unknown): unknown {
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded bg-background p-2">{children}</pre>;
}

// Render a list of retrieved/reranked documents (strings or {content,score,...}).
function DocList({ value }: { value: unknown }) {
  const arr = parseMaybeJson(value);
  if (!Array.isArray(arr)) return <Pre>{String(value)}</Pre>;
  return (
    <div className="max-h-60 space-y-2 overflow-auto">
      {arr.map((d: any, i: number) => {
        const content =
          typeof d === 'string' ? d : d?.content ?? d?.text ?? d?.page_content ?? JSON.stringify(d);
        const score = typeof d === 'object' && d ? d.score ?? d.relevance_score : undefined;
        return (
          <div key={i} className="rounded border bg-background p-2">
            {score != null ? <div className="mb-1 text-[10px] text-muted-foreground">score {Number(score).toFixed(3)}</div> : null}
            <div className="whitespace-pre-wrap">{String(content)}</div>
          </div>
        );
      })}
    </div>
  );
}

function SpanDetail({ node }: { node: SpanNode }) {
  const a = (node.attributes ?? {}) as Record<string, unknown>;
  const consumed = new Set<string>(['input.value', 'output.value', 'logsneat.span.kind']);
  const use = (k: string) => {
    consumed.add(k);
    return a[k];
  };

  const facts: [string, string][] = [
    ['Status', statusText(node)],
    ['Duration', `${node.durationMs.toFixed(1)} ms`],
    ['Scope', node.scopeName ?? '—'],
  ];
  if (node.model) facts.push(['Model', node.model]);
  if (node.totalTokens != null) facts.push(['Tokens', String(node.totalTokens)]);
  if (node.costUsd != null) facts.push(['Cost', `$${Number(node.costUsd).toFixed(6)}`]);

  // VECTOR_STORE config → facts
  const vfacts: [string, string][] = [
    ['Index', 'logsneat.vectordb.index_name'],
    ['Embedding', 'logsneat.vectordb.embedding_model'],
    ['Dimension', 'logsneat.vectordb.vector_dimension'],
    ['Similarity', 'logsneat.vectordb.similarity_algorithm'],
  ];
  for (const [label, key] of vfacts) if (a[key] != null) facts.push([label, String(use(key))]);
  if (a['logsneat.retrieval.top_k'] != null) facts.push(['Top K', String(use('logsneat.retrieval.top_k'))]);
  if (a['logsneat.reranker.top_k'] != null) facts.push(['Top N', String(use('logsneat.reranker.top_k'))]);

  const query = use('logsneat.retrieval.query') ?? use('logsneat.reranker.query');
  const retrievalDocs = use('logsneat.retrieval.documents');
  const rerankIn = use('logsneat.reranker.input_documents');
  const rerankOut = use('logsneat.reranker.output_documents');
  const guardInput = use('logsneat.guardrail.input');
  const guardPassed = use('logsneat.guardrail.passed');
  const guardOutput = use('logsneat.guardrail.output');

  const inMsg = a['llm.input_messages.0.message.content'];
  const outMsg = a['llm.output_messages.0.message.content'];
  if (inMsg !== undefined) consumed.add('llm.input_messages.0.message.content');
  if (outMsg !== undefined) consumed.add('llm.output_messages.0.message.content');
  const input = a['input.value'] ?? inMsg;
  const output = a['output.value'] ?? outMsg;

  const passed = guardPassed === true || guardPassed === 'true';
  const hasGuard = guardPassed != null || guardInput != null || guardOutput != null;

  const rest = Object.fromEntries(Object.entries(a).filter(([k]) => !consumed.has(k)));

  return (
    <div className="space-y-3 border-b bg-muted/30 px-4 py-3 text-xs">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {facts.map(([k, v]) => (
          <div key={k}>
            <div className="text-muted-foreground">{k}</div>
            <div className={cn('mt-0.5 break-words font-medium', k === 'Status' && node.statusCode === 2 && 'text-red-600 dark:text-red-400')}>
              {v}
            </div>
          </div>
        ))}
      </div>

      {query != null ? <Block title="Query"><Pre>{String(query)}</Pre></Block> : null}

      {hasGuard ? (
        <Block title="Guardrail">
          <div className="space-y-2">
            {guardPassed != null ? (
              <Badge
                variant="outline"
                className={cn(
                  passed
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
                )}
              >
                {passed ? 'passed' : 'failed'}
              </Badge>
            ) : null}
            {guardInput != null ? <Pre>{String(guardInput)}</Pre> : null}
            {guardOutput != null ? <div className="text-muted-foreground">{String(guardOutput)}</div> : null}
          </div>
        </Block>
      ) : null}

      {retrievalDocs != null ? <Block title="Retrieved documents"><DocList value={retrievalDocs} /></Block> : null}
      {rerankIn != null ? <Block title="Input documents"><DocList value={rerankIn} /></Block> : null}
      {rerankOut != null ? <Block title="Reranked documents"><DocList value={rerankOut} /></Block> : null}

      {input != null ? <Block title="Input"><Pre>{String(input)}</Pre></Block> : null}
      {output != null ? <Block title="Output"><Pre>{String(output)}</Pre></Block> : null}

      {Object.keys(rest).length > 0 ? (
        <Block title="Attributes">
          <pre className="max-h-60 overflow-auto rounded bg-background p-2">{JSON.stringify(rest, null, 2)}</pre>
        </Block>
      ) : null}
    </div>
  );
}

function Row({
  node,
  depth,
  open,
  toggle,
}: {
  node: SpanNode;
  depth: number;
  open: Set<string>;
  toggle: (id: string) => void;
}) {
  const isOpen = open.has(node.spanId);
  const error = node.statusCode === 2;
  const meta = [node.model, node.totalTokens ? `${node.totalTokens} tok` : null].filter(Boolean).join(' · ');

  return (
    <>
      <button
        onClick={() => toggle(node.spanId)}
        className="flex w-full items-center gap-2 border-b py-2 pr-3 text-left text-sm transition-colors last:border-0 hover:bg-accent/50"
        style={{ paddingLeft: depth * 16 + 8 }}
      >
        {isOpen ? (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        )}
        <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
          {node.kind ?? '—'}
        </Badge>
        <span className={cn('truncate font-medium', error && 'text-red-600 dark:text-red-400')}>{node.name}</span>
        {error ? <span className="size-1.5 shrink-0 rounded-full bg-red-500" /> : null}
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {meta ? <span className="mr-3">{meta}</span> : null}
          {node.durationMs.toFixed(1)} ms
        </span>
      </button>
      {isOpen ? <SpanDetail node={node} /> : null}
      {node.children.map((c) => (
        <Row key={c.spanId} node={c} depth={depth + 1} open={open} toggle={toggle} />
      ))}
    </>
  );
}

export function SpanTree({ spans }: { spans: SpanNode[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="overflow-hidden rounded-md border">
      {spans.map((s) => (
        <Row key={s.spanId} node={s} depth={0} open={open} toggle={toggle} />
      ))}
    </div>
  );
}
