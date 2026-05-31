ALTER TABLE "traces" ADD COLUMN "llm_call_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "tool_call_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "retriever_call_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "retriever_doc_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "max_span_latency_ms" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "has_tool_error" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "guardrail_blocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "output_empty" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "models" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "kinds" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "traces" ADD COLUMN "span_kind_counts" jsonb DEFAULT '{}'::jsonb NOT NULL;