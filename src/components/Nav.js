import ThemeToggle from "./ThemeToggle";
import React, { useEffect, useState } from "react";
import { greeting, nav } from "../portfolio";
import "./Nav.css";

export default function Nav({ ready }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`nav ${ready ? "nav--ready" : ""}`}>
      <a className="nav__name" href="#home" onClick={() => setOpen(false)}>
        {greeting.displayName.toUpperCase()}
      </a>
      <ThemeToggle />
      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className="nav__bars" aria-hidden="true" />
      </button>
      <nav id="nav-links" className={`nav__links ${open ? "is-open" : ""}`} aria-label="Sections">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={active === n.id ? "is-active" : ""}
            aria-current={active === n.id ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </a>
        ))}
      </nav>
      <span className="nav__progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  );
}
