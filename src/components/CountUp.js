import React, { useEffect, useState } from "react";
import useReducedMotion from "../lib/useReducedMotion";

/* "110" or "2.2 → 0.3 s": every number in the text counts up from 0 once `active`. */
export default function CountUp({ value, active }) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) { setP(1); return undefined; }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 1300);
      setP(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  const text = value.replace(/\d+(\.\d+)?/g, (n) => {
    const dec = (n.split(".")[1] || "").length;
    return (parseFloat(n) * p).toFixed(dec);
  });
  return <>{text}</>;
}
