// Semantic role of a span. Stored as logsneat.span.kind; drives dashboard views.
export type SpanKind =
  | 'WORKFLOW'
  | 'AGENT'
  | 'CHAIN'
  | 'TOOL'
  | 'RETRIEVER'
  | 'RERANKER'
  | 'EMBEDDING'
  | 'GUARDRAIL'
  | 'MCP_TOOL'
  | 'VECTOR_STORE';
