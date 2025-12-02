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

        <section className="flex flex-col gap-10 text-sm">
          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Browse Shadcn components</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Explore the full Shadcn component library from the sidebar.
            </p>
            <video
              src="/assets/Playgroundcn - Sidebar.mov"
              aria-label="Browse Shadcn components from the sidebar"
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-h-[420px] rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Edit code &amp; preview instantly</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Edit component files and watch the preview update as you type.
            </p>
            <video
              src="/assets/Playgroundcn - editor and live preview.mov"
              aria-label="Edit component code and see a live preview"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Apply curated styles</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Swap between prebuilt styles from Tweakcn using the styles dropdown.
            </p>
            <video
              src="/assets/Playgroundcn - Styles.mov"
              aria-label="Switch between different styles from Tweakcn"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Toggle light &amp; dark modes</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Preview every style in both light and dark themes with a click.
            </p>
            <video
              src="/assets/Playgroundcn - Toggle light:dark.mov"
              aria-label="Toggle between light and dark themes"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Copy production‑ready code</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Copy component code and paste it directly into your repo.
            </p>
            <video
              src="/assets/Playground - Copy code (light).mov"
              aria-label="Copy component code to your own project"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Keep edits while you explore</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Switch between components without losing changes until you refresh.
            </p>
            <video
              src="/assets/Playgroundcn - keep cache.mov"
              aria-label="Keep edits while switching between components"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>

          <article className="space-y-2 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h2 className="text-base font-medium">Jump anywhere with Command+K</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Use Command+K to search for and open any component in seconds.
            </p>
            <video
              src="/assets/Playgroundcn - Searching.mov"
              aria-label="Search for components with Command+K"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/60 object-cover dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          </article>
        </section>
      </main>
    </div>
  );
}