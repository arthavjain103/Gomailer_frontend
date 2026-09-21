"use client";

import * as React from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useAnimate, stagger as motionStagger } from "framer-motion";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"];

function BaseRippleWave({
  text = "Ripple Wave",
  font = {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 120,
    lineHeight: "1.5em",
    letterSpacing: "0em",
    textAlign: "left",
  },
  color = "#FFFFFF",
  tag = "h3",
  waveFrequency = 0.8,
  waveAmplitude = 60,
  scaleBase = 0.5,
  scaleAmplitude = 0.5,
  startOpacity = 0,
  stagger = 0.03,
  transition = { type: "spring", stiffness: 300, damping: 15, mass: 1 },
  appearTrigger = "default",
  scrollConfig = { position: "bottom", distance: 20 },
}) {
  const [scope, animate] = useAnimate();
  const hoverFiredRef = useRef(false);

  const chars = useMemo(() => (text ?? "").split(""), [text]);
  const charsConfig = useMemo(() => {
    return chars.map((char, i) => {
      const startY = Math.sin(i * waveFrequency) * waveAmplitude;
      const startScale = scaleBase + Math.abs(Math.sin(i * waveFrequency)) * scaleAmplitude;
      return { char, startY, startScale };
    });
  }, [chars, waveFrequency, waveAmplitude, scaleBase, scaleAmplitude]);

  const resetToHidden = useCallback(() => {
    if (!scope.current) return;
    animate(".char", { y: "var(--start-y)", scale: "var(--start-scale)", opacity: startOpacity }, { duration: 0 });
  }, [animate, startOpacity, scope]);

  const runAppear = useCallback(() => {
    if (!scope.current) return;
    animate(".char", { y: 0, scale: 1, opacity: 1 }, { ...transition, delay: motionStagger(stagger) });
  }, [animate, transition, stagger, scope]);

  useEffect(() => {
    let rafId = null;
    resetToHidden();
    hoverFiredRef.current = false;
    if (appearTrigger === "default") {
      const t = setTimeout(runAppear, 50);
      return () => clearTimeout(t);
    }
    if (appearTrigger === "scroll") {
      const el = scope.current;
      if (!el) return;
      const scrollPos = scrollConfig?.position ?? "bottom";
      const scrollDist = Math.max(0, Math.min(100, scrollConfig?.distance ?? 20));
      const check = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const rect = el.getBoundingClientRect();
        if (scrollPos === "top") return rect.top <= vh * (scrollDist / 100);
        return rect.bottom <= vh * (1 - scrollDist / 100);
      };
      if (check()) { runAppear(); return; }
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          rafId = window.requestAnimationFrame(() => {
            if (check()) {
              runAppear();
              window.removeEventListener("scroll", onScroll, true);
              window.removeEventListener("resize", onScroll);
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }
  }, [appearTrigger, scrollConfig?.position, scrollConfig?.distance, runAppear, resetToHidden, scope]);

  const fontStyles = (font ?? {});
  const safeTag = TAGS.includes(tag) ? tag : "h1";
  const Tag = motion[safeTag];

  return (
    <div
      onMouseEnter={() => {
        if (appearTrigger === "hover" && !hoverFiredRef.current) {
          hoverFiredRef.current = true;
          runAppear();
        }
      }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: fontStyles.textAlign === "right" ? "flex-end" : fontStyles.textAlign === "center" ? "center" : "flex-start",
        overflow: "visible",
      }}
    >
      <Tag ref={scope} aria-label={text} style={{ margin: 0, display: "inline-block", whiteSpace: "pre-wrap", ...fontStyles, color }}>
        {charsConfig.map((item, index) => (
          <motion.span
            key={index}
            className="char"
            aria-hidden="true"
            style={{ display: "inline-block", "--start-y": `${item.startY}px`, "--start-scale": item.startScale, y: "var(--start-y)", scale: "var(--start-scale)", opacity: startOpacity, willChange: "transform, opacity" }}
          >
            {item.char === " " ? "\u00A0" : item.char}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}

export default function RippleWave(props) {
  const preset = {
    text: "MOTION TEXT WAVE",
    font: { fontFamily: "Inter", fontWeight: 700, fontSize: "75px", textAlign: "center", lineHeight: "1.5em", letterSpacing: "0em" },
    waveAmplitude: 200,
    startOpacity: 1,
    tag: "h1",
  };
  return <BaseRippleWave {...preset} {...props} />;
}
