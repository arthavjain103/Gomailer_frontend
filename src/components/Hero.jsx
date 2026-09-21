import RippleWave from "./RippleWave.jsx";
import VectorWordmark from "./VectorWordmark.jsx";

const stats = [
  { value: "10K+", label: "Recipients" },
  { value: "5", label: "Workers" },
  { value: "3", label: "Retries" },
  { value: "99.9%", label: "Delivered" },
];

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 sm:pt-40">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Reliable Bulk Email Delivery, Built for Scale
        </span>

        <div className="mt-6">
          <RippleWave
            text="Send 10,000+ Emails."
            color="#FFFFFF"
            tag="h1"
            font={{ fontFamily: "Inter", fontWeight: 800, fontSize: "56px", lineHeight: "1.05em", letterSpacing: "-0.03em", textAlign: "center" }}
            waveFrequency={0.55}
            waveAmplitude={70}
            scaleBase={0.6}
            scaleAmplitude={0.4}
            startOpacity={0}
            stagger={0.025}
          />
          <RippleWave
            text="Reliably."
            color="#a1a1aa"
            tag="h1"
            font={{ fontFamily: "Inter", fontWeight: 800, fontSize: "56px", lineHeight: "1.05em", letterSpacing: "-0.03em", textAlign: "center" }}
            waveFrequency={0.55}
            waveAmplitude={70}
            scaleBase={0.6}
            scaleAmplitude={0.4}
            startOpacity={0}
            stagger={0.05}
          />
        </div>

        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-zinc-400">
          GoMailer sends bulk email without the drama — no lost messages,
          no duplicates, no overload. Just fast, reliable delivery.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#demo" className="rounded-2xl bg-white px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-zinc-200">
            Explore GoMailer →
          </a>
          <a href="#benefits" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-white/10">
            Why GoMailer
          </a>
        </div>

        {/* Interactive dotted wordmark */}
        <div className="mx-auto mt-10 h-[220px] max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] sm:h-[260px]">
          <VectorWordmark
            text="GOMAILER"
            background="transparent"
            textColor="#FFFFFF"
            shade="#52525b"
            accent="rgba(255,255,255,0.4)"
            font={{ fontFamily: "Inter", fontWeight: 800, fontSize: "190px", lineHeight: "1em", letterSpacing: "-0.02em", textAlign: "center" }}
          />
        </div>
        <p className="mt-3 font-mono text-[12px] text-zinc-500">move your cursor over it — every dot is live</p>

        <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="text-[18px] font-bold text-white">{s.value}</div>
              <div className="mt-0.5 text-[12px] text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
