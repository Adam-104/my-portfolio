import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { greeting } from "../portfolio";
import useReducedMotion from "../lib/useReducedMotion";
import "./Extras.css";

const Ctx = createContext(null);

/* A red panel wipes up over the page, the route changes underneath, then it wipes away. */
export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState("idle");
  const busy = useRef(false);

  const go = useCallback(
    (to) => {
      if (busy.current) return;
      if (reduced) { navigate(to); window.scrollTo(0, 0); return; }
      busy.current = true;
      setPhase("in");
      setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);
        setPhase("out");
        setTimeout(() => { setPhase("idle"); busy.current = false; }, 600);
      }, 600);
    },
    [navigate, reduced]
  );

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className={`wipe wipe--${phase}`} aria-hidden="true">
        <span>{greeting.displayName.toUpperCase()}</span>
      </div>
    </Ctx.Provider>
  );
}

export function TLink({ to, children, ...rest }) {
  const go = useContext(Ctx);
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return <a href={to} onClick={onClick} {...rest}>{children}</a>;
}
