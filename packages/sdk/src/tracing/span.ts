import { trace } from './trace';
import type { SpanKind } from './kinds';

export interface SpanOptions {
  name?: string;
  kind?: SpanKind;
  attributes?: Record<string, string | number | boolean>;
}

// Wrap a function so every call to it produces a span. (JS can't decorate free
// functions, so this HOF is the manual-instrumentation idiom.)
export function span<A extends unknown[], R>(
  options: SpanOptions,
  fn: (...args: A) => Promise<R> | R,
): (...args: A) => Promise<R> {
  return (...args: A) =>
    trace(options.name ?? fn.name ?? 'span', { kind: options.kind, attributes: options.attributes }, () => fn(...args));
}
