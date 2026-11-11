import React, { useEffect, useRef } from "react";
import "./Extras.css";

/* A small dot plus a trailing ring. Only on devices with a real mouse. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const t = e.target.closest && e.target.closest("a, button, input, textarea, .laptop");
      ring.current.classList.toggle("is-link", !!t);
      dot.current.classList.add("is-on");
      ring.current.classList.add("is-on");
    };
    const onLeave = () => {
      dot.current.classList.remove("is-on");
      ring.current.classList.remove("is-on");
    };
    const onDown = () => ring.current.classList.add("is-down");
    const onUp = () => ring.current.classList.remove("is-down");
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div className="cursor__ring" ref={ring} aria-hidden="true"><span /></div>
      <div className="cursor__dot" ref={dot} aria-hidden="true" />
    </>
  );
}
