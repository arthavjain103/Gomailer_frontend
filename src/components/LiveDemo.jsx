import IOSMessageList from "./IOSMessageList.jsx";
import TextEmerge from "./TextEmerge.jsx";

const messages = [
  { text: "Campaign started", sender: "them", timestamp: "10:14 AM" },
  { text: "10,000 recipients queued", sender: "me", timestamp: "10:14 AM" },
  { text: "5 workers processing", sender: "them", timestamp: "10:15 AM" },
  { text: "Delivery completed successfully", sender: "me", timestamp: "10:16 AM" },
];

export default function LiveDemo() {
  return (
    <section id="demo" className="mx-auto max-w-5xl scroll-mt-28 px-4 pt-20 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-bold tracking-widest text-zinc-400 uppercase">Live preview</p>
          <h2 className="mt-3">
            <TextEmerge
              text="Watch a campaign deliver itself"
              tag="p"
              color="#ffffff"
              font={{ fontFamily: "Inter", fontWeight: 700, fontSize: "34px", letterSpacing: "-0.02em", lineHeight: "1.15em", textAlign: "left" }}
              staggerFrom="center"
              transition={{ duration: 0.5, delay: 0, ease: "easeOut", staggerChildren: 0.04 }}
            />
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
            Hit send, and GoMailer queues 10,000 recipients, puts 5 workers
            on it, and reports back — all in real time.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div>
              <div className="text-[22px] font-bold text-white">842<span className="text-[14px] font-medium text-zinc-400">/min</span></div>
              <div className="text-[12px] text-zinc-500">sending speed</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-[22px] font-bold text-white">99.9%</div>
              <div className="text-[12px] text-zinc-500">delivered</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-[22px] font-bold text-white">0</div>
              <div className="text-[12px] text-zinc-500">lost</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101015]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            </div>
            <span className="flex items-center gap-2 text-[13px] font-semibold text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              live campaign
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-300">:8080</span>
          </div>
          <div className="h-[300px] overflow-hidden">
            <IOSMessageList
              messages={messages}
              sentBubbleColor="#FAFAFA"
              sentTextColor="#09090B"
              receivedBubbleColor="#26262e"
              receivedTextColor="#FAFAFA"
              showTimestamps
              showTyping
              typingSender="them"
              staggerDelay={650}
              style={{ overflowX: "hidden" }}
            />
          </div>
          <div className="border-t border-white/10 px-5 py-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[86%] rounded-full bg-white" />
            </div>
            <p className="mt-2 text-[12px] font-medium text-zinc-400">summer-launch — 8,620 of 10,000 delivered</p>
          </div>
        </div>
      </div>
    </section>
  );
}
