import { useState, useEffect } from "react";
import SmoothScrollSlider from "./SmoothScrollSlider.jsx";

const cards = [
  { title: "Never lose mail", desc: "Every email is saved before sending. Restarts change nothing." },
  { title: "Never double-send", desc: "Retries are safe — duplicates collapse into one send." },
  { title: "Stays fast", desc: "5 workers send together. 800+ emails a minute." },
  { title: "Won't get blocked", desc: "Gentle pacing keeps providers happy." },
  { title: "Always visible", desc: "Watch queued, sent and delivered counts live." },
  { title: "Easy to run", desc: "One binary, one queue. Up in minutes." },
];

function CardFace({ card, index }) {
  return (
    <div className="flex h-full flex-col justify-between bg-[#141419] p-6 text-left">
      <div>
        <span className="font-mono text-[12px] text-zinc-500">0{index + 1}</span>
        <h3 className="mt-3 text-[21px] font-bold tracking-tight text-white">{card.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{card.desc}</p>
      </div>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-white/80" />
      </div>
    </div>
  );
}

export default function PipelineCarousel() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
      <p className="text-center text-[13px] font-semibold tracking-wide text-zinc-400">
        DRAG OR SCROLL — WHAT YOU GET
      </p>
      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
        <div className="h-[280px] sm:h-[300px]">
          <SmoothScrollSlider
            slides={cards}
            renderSlide={(card, i) => <CardFace card={card} index={i % cards.length} />}
            slideWidth={isMobile ? 260 : 320}
            slideHeight={isMobile ? 200 : 220}
            spacing={2.5}
            direction="right"
            smoothness={9}
            radius={18}
            dim={5}
            background="transparent"
            sensitivity={6}
            loop
          />
        </div>
      </div>
    </section>
  );
}
