import TextEmerge from "./TextEmerge.jsx";

const benefits = [
  { title: "No lost emails", desc: "Crashes, restarts, hiccups — your queue survives all of it." },
  { title: "No duplicates", desc: "Send the same campaign twice by accident? Only one goes out." },
  { title: "No overload", desc: "Smart pacing protects your sender reputation automatically." },
  { title: "No babysitting", desc: "Failures retry on their own. Broken ones wait aside for you." },
  { title: "No guessing", desc: "See exactly what's queued, sent, and delivered — live." },
  { title: "No heavy setup", desc: "Go + Redis. One binary, one queue, running in minutes." },
];

export default function Benefits() {
  return (
    <section id="benefits" className="mx-auto max-w-5xl scroll-mt-28 px-4 pt-20 sm:px-6">
      <div className="text-center">
        <p className="text-[12px] font-bold tracking-widest text-zinc-400 uppercase">Benefits</p>
        <h2 className="mt-3">
          <TextEmerge
            text="Email delivery you stop thinking about"
            tag="p"
            color="#ffffff"
            font={{ fontFamily: "Inter", fontWeight: 700, fontSize: "36px", letterSpacing: "-0.02em", lineHeight: "1.15em", textAlign: "center" }}
            staggerFrom="center"
            transition={{ duration: 0.5, delay: 0, ease: "easeOut", staggerChildren: 0.04 }}
          />
        </h2>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-[16px] font-bold text-white">{b.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
