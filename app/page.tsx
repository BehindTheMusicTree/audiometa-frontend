import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-8 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Audiometa
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Audio metadata manager – view and inspect full metadata for audio files.
        </p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            href="/metadata-manager"
            className="flex h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Metadata Manager
          </Link>
        </nav>
      </main>
    </div>
  );
}
