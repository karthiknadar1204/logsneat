export interface LogsneatConfig {
  apiKey?: string; // defaults to LOGSNEAT_API_KEY
  endpoint?: string; // defaults to LOGSNEAT_ENDPOINT or http://localhost:3004
  workflowName?: string; // label for this app, shown in the dashboard
  instrumentations?: string[]; // libraries to auto-instrument (default: ["openai"])
  tags?: string[]; // free-form labels attached to every trace
  userId?: string; // the end-user of your app (for filtering/grouping)
  sessionId?: string; // custom session id to group traces
  autoSession?: boolean; // generate a session id at startup
}
