export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="7" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="text-[16px] font-bold tracking-tight text-white">GoMailer</span>
          </a>
          <nav className="hidden items-center gap-6 text-[14px] font-medium text-zinc-400 md:flex">
            <a href="#benefits" className="transition hover:text-white">Benefits</a>
            <a href="#demo" className="transition hover:text-white">Live demo</a>
          </nav>
          <a href="#demo" className="rounded-xl bg-white px-4 py-2 text-[14px] font-semibold text-black transition hover:bg-zinc-200">
            Explore GoMailer
          </a>
        </div>
      </div>
    </header>
  );
}
