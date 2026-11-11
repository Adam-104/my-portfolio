import React, { useEffect, useState } from "react";
import useReducedMotion from "../lib/useReducedMotion";

/* Types out `lines` ({cmd, out}) while `active` is true, and clears when it turns false. */
export default function Terminal({ lines, active, className = "" }) {
  const reduced = useReducedMotion();
  const [view, setView] = useState([]);

  useEffect(() => {
    if (!active) { setView([]); return undefined; }
    if (reduced) { setView(lines.map((l) => ({ cmd: l.cmd, out: l.out }))); return undefined; }
    const timers = [];
    const state = lines.map(() => ({ cmd: "", out: "" }));
    const push = () => setView(state.map((s) => ({ ...s })));
    let t = 150;
    lines.forEach((l, i) => {
      for (let c = 1; c <= l.cmd.length; c++) {
        t += 30;
        timers.push(setTimeout(() => { state[i].cmd = l.cmd.slice(0, c); push(); }, t));
      }
      t += 240;
      timers.push(setTimeout(() => { state[i].out = l.out; push(); }, t));
      t += 260;
    });
    return () => timers.forEach(clearTimeout);
  }, [active, lines, reduced]);

  const shown = view.filter((l) => l.cmd);
  const last = shown.length - 1;
  return (
    <div className={`term ${className}`} aria-hidden="true">
      {shown.map((l, i) => (
        <div key={i} className="term__line">
          <p className="term__cmd"><i>$</i> {l.cmd}{i === last && !l.out && <b className="term__caret" />}</p>
          {l.out && <p className="term__out">{l.out}{i === last && <b className="term__caret" />}</p>}
        </div>
      ))}
    </div>
  );
}
