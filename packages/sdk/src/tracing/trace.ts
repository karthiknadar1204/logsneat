import { trace as otelTrace, SpanStatusCode, type Span } from '@opentelemetry/api';
import type { SpanKind } from './kinds';

export interface TraceOptions {
  kind?: SpanKind;
  attributes?: Record<string, string | number | boolean>;
}

// Run fn inside a span. Child spans (manual or auto-instrumented) nest under it.
export function trace<T>(name: string, options: TraceOptions, fn: (span: Span) => Promise<T> | T): Promise<T> {
  const tracer = otelTrace.getTracer('logsneat');
  return tracer.startActiveSpan(name, async (span) => {
    if (options.kind) span.setAttribute('logsneat.span.kind', options.kind);
    if (options.attributes) span.setAttributes(options.attributes);

    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error)?.message });
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
}
