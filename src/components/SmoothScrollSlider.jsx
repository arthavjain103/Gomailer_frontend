"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLACEHOLDER_COUNT = 8;
const MAX_SCALE = 2.5;
const MIN_SCALE = 0.1;

function wrap(value, span) {
  return ((value % span) + span) % span;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resolveSrc(value) {
  if (!value) return null;
  if (typeof value === "string") return value || null;
  const src = value.src;
  return typeof src === "string" && src ? src : null;
}

function imageOf(item) {
  if (item && typeof item === "object" && "image" in item)
    return resolveSrc(item.image);
  return resolveSrc(item);
}

function offsetOf(item) {
  if (item && typeof item === "object" && "offsetY" in item) {
    const offset = item.offsetY;
    return typeof offset === "number" && isFinite(offset) ? offset : 0;
  }
  return 0;
}

function placeholderFill(index) {
  const hues = [212, 200, 222, 190, 215, 205, 225, 195];
  const hue = hues[index % hues.length];
  return `linear-gradient(150deg, hsl(${hue} 90% 97%), hsl(${hue} 85% 90%))`;
}

export default function SmoothScrollSlider({
  images = [],
  slides: customSlides,
  renderSlide,
  slideWidth = 400,
  slideHeight = 400,
  spacing = 2,
  direction = "right",
  smoothness = 10,
  radius = 16,
  dim = 10,
  background = "transparent",
  sensitivity = 5,
  loop = true,
  style,
}) {
  const containerRef = useRef(null);
  const nodes = useRef([]);
  const target = useRef(0);
  const current = useRef(0);
  const [width, setWidth] = useState(0);

  const source = useMemo(() => {
    if (customSlides && customSlides.length) {
      return customSlides.map((s, idx) => ({
        src: s.src || null,
        offsetY: s.offsetY || 0,
        data: s,
        key: idx,
      }));
    }
    const resolved = [];
    for (const item of images ?? []) {
      const src = imageOf(item);
      if (src) resolved.push({ src, offsetY: offsetOf(item) });
    }
    return resolved.length
      ? resolved
      : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
          src: null,
          offsetY: 0,
        }));
  }, [images, customSlides]);

  const step = slideWidth + clamp(spacing, 0, 10) * 20;
  const ease = 0.15 - (clamp(smoothness, 0, 10) / 10) * 0.13;
  const dimAmount = (clamp(dim, 0, 10) / 10) * 0.85;
  const wheelMultiplier = 0.4 + (clamp(sensitivity, 0, 10) / 10) * 1.2;
  const dragMultiplier = 0.6 + (clamp(sensitivity, 0, 10) / 10) * 1.8;

  const flip = direction === "left";

  const repeats = useMemo(() => {
    if (!loop || width <= 0 || step <= 0) return 1;
    return Math.max(1, Math.ceil((width + step * 2) / (source.length * step)));
  }, [loop, width, step, source.length]);

  const slides = useMemo(() => {
    const out = [];
    for (let r = 0; r < repeats; r += 1) out.push(...source);
    return out;
  }, [source, repeats]);

  const frame = useRef({
    count: 0,
    step: 0,
    slideWidth: 0,
    width: 0,
    ease: 0.075,
    maxScale: MAX_SCALE,
    minScale: MIN_SCALE,
    dim: 0,
    loop: true,
    flip: false,
  });
  frame.current = {
    count: slides.length,
    step,
    slideWidth,
    width,
    ease,
    maxScale: MAX_SCALE,
    minScale: MIN_SCALE,
    dim: dimAmount,
    loop,
    flip,
  };

  const input = useRef({ wheelMultiplier, dragMultiplier, flip });
  input.current = { wheelMultiplier, dragMultiplier, flip };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    setWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    nodes.current.length = slides.length;
  }, [slides.length]);

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const c = frame.current;
      const delta = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      if (!c.count || c.step <= 0 || c.width <= 0) return;

      const span = c.count * c.step;

      if (c.loop) {
        if (current.current > span || current.current < -span) {
          const shift = Math.trunc(current.current / span) * span;
          current.current -= shift;
          target.current -= shift;
        }
      } else {
        target.current = clamp(target.current, 0, (c.count - 1) * c.step);
      }

      const k = 1 - Math.pow(1 - c.ease, delta * 60);
      current.current += (target.current - current.current) * k;

      const pad = (c.width - c.slideWidth) / 2;
      const half = c.width / 2;

      for (let i = 0; i < c.count; i += 1) {
        const node = nodes.current[i];
        if (!node) continue;

        const raw = i * c.step - current.current + pad;

        const x = c.loop ? wrap(raw + c.step, span) - c.step : raw;

        const distance = x + c.slideWidth / 2 - half;
        let scale;
        let push;
        if (distance > 0) {
          scale = Math.min(c.maxScale, 1 + distance / c.width);
          push = (scale - 1) * c.slideWidth * 0.75;
        } else {
          scale = Math.max(c.minScale, 1 + distance / c.width);
          push = 0;
        }

        const left = c.flip ? c.width - c.slideWidth - (x + push) : x + push;
        node.style.transform = `translate3d(${left}px, -50%, 0) scale(${scale})`;

        if (c.dim > 0 && scale < 1) {
          const t = (1 - scale) / Math.max(0.001, 1 - c.minScale);
          node.style.filter = `brightness(${1 - t * c.dim}) saturate(${
            1 - t * 0.4
          })`;
        } else {
          node.style.filter = "none";
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onWheel = (event) => {
      event.preventDefault();
      const dominant =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      target.current += dominant * input.current.wheelMultiplier;
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let pointer = null;
    let lastX = 0;

    const onDown = (event) => {
      if (pointer !== null) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      node.setPointerCapture(event.pointerId);
      node.style.cursor = "grabbing";
    };
    const onMove = (event) => {
      if (pointer !== event.pointerId) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      target.current += (input.current.flip ? dx : -dx) * input.current.dragMultiplier;
    };
    const onUp = (event) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      node.style.cursor = "grab";
      if (node.hasPointerCapture(event.pointerId))
        node.releasePointerCapture(event.pointerId);
    };

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
        cursor: "grab",
        touchAction: "pan-y",
        opacity: width > 0 ? 1 : 0,
        transition: "opacity 0.35s ease",
        ...style,
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: slideWidth,
            height: slideHeight,
            borderRadius: radius,
            overflow: "hidden",
            background: slide.src ? "#fff" : "#141419",
            willChange: "transform, filter",
            transform: "translate3d(0, -50%, 0)",
            pointerEvents: "none",
            boxShadow: "0 20px 50px -20px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {slide.src ? (
            <img
              src={slide.src}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `50% calc(50% + ${slide.offsetY}px)`,
                display: "block",
                userSelect: "none",
              }}
            />
          ) : renderSlide ? (
            renderSlide(slide.data, i)
          ) : null}
        </div>
      ))}
    </div>
  );
}
