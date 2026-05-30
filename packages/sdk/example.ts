// Example app using the logsneat SDK. Run with API_KEY + OPENAI_API_KEY set.
import * as logsneat from './src/index';
import * as openai from 'openai';

await logsneat.init({
  apiKey: process.env.API_KEY,
  workflowName: 'sdk-demo',
  instrumentations: ['openai'],
  userId: 'user_42',
  tags: ['demo', 'phase3'],
  autoSession: true,
});

const client = new openai.OpenAI();

// A tool, wrapped with span() — produces a TOOL span.
const getCity = logsneat.span({ kind: 'TOOL', name: 'get_city' }, async () => {
  return 'Paris';
});

// The entry point, wrapped with trace() — the WORKFLOW root.
await logsneat.trace('handle_request', { kind: 'WORKFLOW' }, async () => {
  const city = await getCity();
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: `Tell me one short fact about ${city}.` }],
  });
  console.log(res.choices[0]?.message.content);
});

await logsneat.flush();
await logsneat.shutdown();
