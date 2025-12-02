export default function Home() {
  return (
    <div className="min-h-screen font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-10 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Shadcn playground
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Design, tweak, and copy Shadcn components in one place.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Browse components, try different styles, and copy the code you like.
            Your changes stay while you explore, and reset on refresh.
          </p>
        </header>

        <section className="grid gap-6 text-sm sm:grid-cols-2">
          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Browse Shadcn components</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Explore the full Shadcn component library from the sidebar.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Edit component source</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Open any component’s code files and customize them in-place.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Preview changes instantly</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              See a live preview update as you type, no extra setup needed.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Apply curated styles</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Swap between prebuilt styles from Tweakcn using the styles dropdown.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Toggle light &amp; dark modes</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Preview every style in both light and dark themes with a click.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Copy production‑ready code</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Copy component code and paste it directly into your repo.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Keep edits while you explore</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Switch between components without losing changes until you refresh.
            </p>
          </article>

          <article className="space-y-2">
            <div className="h-24 rounded-lg border border-dashed border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            <h2 className="text-base font-medium">Jump anywhere with Command+K</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Use Command+K to search for and open any component in seconds.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}