# logsneat

Drop-in observability SDK for AI agents. Trace every workflow, tool call, retrieval step and LLM request as a nested span tree — built on OpenTelemetry — and explore it all in your logsneat dashboard.

## Install

```bash
npm install logsneat openai
```

## Quickstart

```ts
import * as logsneat from 'logsneat';
import OpenAI from 'openai';

await logsneat.init({
  apiKey: process.env.LOGSNEAT_API_KEY, // from your dashboard → API Keys
  workflowName: 'my-agent',
  instrumentations: ['openai'],
});

const openai = new OpenAI();

await logsneat.trace('handle_request', { kind: 'WORKFLOW' }, async () => {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Give me one fun fact about Paris.' }],
  });
  console.log(res.choices[0]?.message.content);
});

await logsneat.flush();
await logsneat.shutdown();
```

## Configuration

`init(config)` options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | `LOGSNEAT_API_KEY` env | Project API key (required). |
| `endpoint` | `string` | `LOGSNEAT_ENDPOINT` or `http://localhost:3004` | Where traces are sent. |
| `workflowName` | `string` | `"default"` | App name shown in the dashboard. |
| `instrumentations` | `string[]` | `["openai"]` | Libraries to auto-instrument. |
| `tags` | `string[]` | — | Labels attached to every trace. |
| `userId` | `string` | — | Your end-user's id (for grouping/filtering). |
| `sessionId` | `string` | — | Group related traces into one conversation. |
| `autoSession` | `boolean` | `false` | Generate a session id at startup. |

## Instrumenting your own code

Use `trace()` to wrap a block, or `span()` to wrap a reusable function:

```ts
// run a block inside a span
await logsneat.trace('process_order', { kind: 'WORKFLOW', attributes: { 'order.id': 'A-1234' } }, async (span) => {
  span.setAttribute('items', 3);
  // ...
});

// wrap a function so every call produces a span
const getWeather = logsneat.span({ kind: 'TOOL', name: 'get_weather' }, async (city: string) => {
  return fetchWeather(city);
});
await getWeather('Paris');
```

### Span kinds

`WORKFLOW`, `AGENT`, `CHAIN`, `TOOL`, `RETRIEVER`, `RERANKER`, `EMBEDDING`, `GUARDRAIL`, `MCP_TOOL`, `VECTOR_STORE`.

## Flushing

In short-lived scripts, flush before exit so no spans are dropped:

```ts
await logsneat.flush();
await logsneat.shutdown();
```

## License

MIT
