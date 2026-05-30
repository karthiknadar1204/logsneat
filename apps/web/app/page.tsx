import Link from "next/link";
import { Button } from "@/components/ui/button";

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* nav */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <span className="font-mono text-base font-medium tracking-tight">
            logsneat
          </span>

          <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <Link href="#" className="transition-colors hover:text-zinc-900">
              Docs
            </Link>
            <Link href="#" className="transition-colors hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="#" className="transition-colors hover:text-zinc-900">
              Changelog
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="#"
              aria-label="GitHub"
              className="hidden p-2 text-zinc-500 transition-colors hover:text-zinc-900 sm:block"
            >
              <GithubMark />
            </Link>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Link
          href="#"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300"
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Open-source agent observability
        </Link>

        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Observability for AI agents,{" "}
          <span className="font-serif text-zinc-500 italic font-normal">
            made simple
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-7 text-zinc-600">
          Trace every run, surface failures, and understand cost and latency
          across your agents — all from one clean dashboard built on
          OpenTelemetry.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Start tracing free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="#">View the docs</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          No credit card required · Drop-in SDK · Self-host or cloud
        </p>
      </main>

      {/* footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 text-xs text-zinc-500">
          <span>© 2026 logsneat</span>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-zinc-900">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
