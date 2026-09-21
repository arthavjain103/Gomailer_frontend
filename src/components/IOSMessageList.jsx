"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useAnimate, stagger as motionStagger } from "framer-motion";

const HIDDEN = { opacity: 0, scale: 0.85, y: 10 };
const SHOWN = { opacity: 1, scale: 1, y: 0 };

const DEFAULT_MESSAGES = [
  { text: "Campaign started", sender: "them", timestamp: "10:14 AM" },
  { text: "10,000 recipients queued", sender: "me", timestamp: "10:15 AM" },
  { text: "5 workers processing", sender: "them", timestamp: "10:15 AM" },
  { text: "Delivery completed successfully", sender: "me", timestamp: "10:16 AM" },
];

const DEFAULT_FONT = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 15,
  lineHeight: "1.35em",
  letterSpacing: "0em",
  textAlign: "left",
};

const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 450,
  damping: 28,
  mass: 1,
};

function TypingBubble({ bubbleColor, isMe }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "12px 16px",
        backgroundColor: bubbleColor,
        borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        border: isMe ? "none" : "1px solid #e2e8f0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: isMe ? "rgba(255, 255, 255, 0.85)" : "#71717a",
            display: "inline-block",
            opacity: 0.5,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

export default function IOSMessageList({
  messages = DEFAULT_MESSAGES,
  font = DEFAULT_FONT,
  sentBubbleColor = "#2563eb",
  sentTextColor = "#FFFFFF",
  receivedBubbleColor = "#ffffff",
  receivedTextColor = "#0f172a",
  showTimestamps = true,
  showTyping = true,
  typingSender = "them",
  animate: doAnimate = true,
  staggerDelay = 450,
  transition = DEFAULT_TRANSITION,
  style,
}) {
  const [scope, animate] = useAnimate();
  const fontStyles = (font ?? {});
  const baseTransition = useMemo(
    () => transition ?? { type: "spring", stiffness: 450, damping: 28 },
    [transition]
  );
  const staggerSec = (staggerDelay ?? 450) / 1000;
  const isTypingFromMe = typingSender === "me";

  const resetToHidden = useCallback(() => {
    if (!scope.current?.querySelectorAll(".msg-item").length) return;
    animate(".msg-item", HIDDEN, { duration: 0 });
  }, [animate, scope]);

  const runAppear = useCallback(() => {
    if (!scope.current?.querySelectorAll(".msg-item").length) return;
    animate(".msg-item", SHOWN, {
      ...baseTransition,
      delay: motionStagger(staggerSec),
    });
  }, [animate, baseTransition, staggerSec, scope]);

  const runDots = useCallback(() => {
    if (!scope.current?.querySelectorAll(".typing-dot").length) return;
    animate(
      ".typing-dot",
      { y: [0, -5, 0], opacity: [0.35, 1, 0.35] },
      {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: motionStagger(0.18),
      }
    );
  }, [animate, scope]);

  // Looping replay: re-run the staggered conversation every cycle
  useEffect(() => {
    runDots();
    if (!doAnimate) {
      animate(".msg-item", SHOWN, { duration: 0 });
      return;
    }
    resetToHidden();
    const t = setTimeout(runAppear, 80);
    // replay loop so hero preview feels live forever
    const loop = setInterval(() => {
      resetToHidden();
      setTimeout(runAppear, 80);
    }, (messages.length + 1) * staggerDelay + 3200);
    return () => {
      clearTimeout(t);
      clearInterval(loop);
    };
  }, [doAnimate, runAppear, resetToHidden, runDots, animate, messages.length, showTyping, staggerDelay]);

  return (
    <div
      ref={scope}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        minWidth: 240,
        minHeight: 120,
        ...fontStyles,
        ...style,
      }}
    >
      {messages.map((msg, index) => {
        const isMe = msg.sender === "me";
        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
              width: "100%",
            }}
          >
            <div
              className="msg-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                maxWidth: "78%",
                willChange: "transform, opacity",
              }}
            >
              {showTimestamps && msg.timestamp && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginBottom: 4,
                    paddingLeft: isMe ? 0 : 12,
                    paddingRight: isMe ? 12 : 0,
                    fontWeight: 400,
                  }}
                >
                  {msg.timestamp}
                </span>
              )}
              <div
                style={{
                  padding: "10px 14px",
                  lineHeight: fontStyles.lineHeight ?? "1.35",
                  fontSize: 14,
                  color: isMe ? sentTextColor : receivedTextColor,
                  backgroundColor: isMe ? sentBubbleColor : receivedBubbleColor,
                  borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  wordBreak: "break-word",
                  boxShadow: isMe
                    ? "0 8px 20px -8px rgba(37,99,235,0.5)"
                    : "0 1px 2px rgba(15,23,42,0.06)",
                  border: isMe ? "none" : "1px solid #e2e8f0",
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}

      {showTyping && (
        <div
          style={{
            display: "flex",
            justifyContent: isTypingFromMe ? "flex-end" : "flex-start",
            width: "100%",
            marginTop: 4,
          }}
        >
          <div
            className="msg-item"
            style={{ display: "inline-flex", willChange: "transform, opacity" }}
          >
            <TypingBubble
              bubbleColor={isTypingFromMe ? sentBubbleColor : receivedBubbleColor}
              isMe={isTypingFromMe}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_MESSAGES };
