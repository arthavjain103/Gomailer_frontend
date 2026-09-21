import TextEmerge from "./TextEmerge.jsx";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-12 text-center sm:px-12">
        <div className="mx-auto max-w-md">
          <TextEmerge
            text="Send your next 10,000 emails without worry."
            tag="p"
            color="#ffffff"
            font={{ fontFamily: "Inter", fontWeight: 700, fontSize: "34px", letterSpacing: "-0.02em", lineHeight: "1.15em", textAlign: "center" }}
            staggerFrom="center"
            transition={{ duration: 0.5, delay: 0, ease: "easeOut", staggerChildren: 0.04 }}
          />
        </div>
        <div className="mt-6">
          <a href="#top" className="inline-block rounded-2xl bg-white px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-zinc-200">
            Explore GoMailer →
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-2 text-[13px] text-zinc-500 sm:flex-row">
        <span className="font-bold text-zinc-300">✉ GoMailer</span>
        <span className="font-mono text-[12px]">10K+ recipients · 5 workers · 3 retries</span>
      </div>
    </footer>
  );
}
