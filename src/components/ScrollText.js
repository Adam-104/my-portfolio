import React, { useEffect, useRef } from "react";

/* Words light up one by one as the paragraph scrolls through the viewport. */
export default function ScrollText({ text, className }) {
  const ref = useRef(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    const spans = Array.from(el.querySelectorAll("span"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { spans.forEach((s) => (s.style.opacity = 1)); return undefined; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.88;
      const end = vh * 0.38;
      const p = Math.max(0, Math.min(1, (start - r.top) / (start - end + r.height * 0.6)));
      const n = spans.length;
      for (let i = 0; i < n; i++) {
        const k = Math.max(0, Math.min(1, p * (n + 6) - i));
        spans[i].style.opacity = String(0.2 + k * 0.8);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ opacity: 0.2, transition: "opacity 0.25s" }}>{w}</span>{" "}
        </React.Fragment>
      ))}
    </p>
  );
}
