ALTER TABLE "traces" DROP COLUMN "llm_call_count";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "tool_call_count";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "retriever_call_count";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "retriever_doc_count";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "max_span_latency_ms";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "has_tool_error";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "guardrail_blocked";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "output_empty";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "models";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "kinds";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "span_kind_counts";--> statement-breakpoint
ALTER TABLE "traces" DROP COLUMN "search_text";