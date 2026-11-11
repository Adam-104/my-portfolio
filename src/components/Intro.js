import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./Intro.css";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>";

/* Text for one frame of a left-to-right scramble from `from` to `to`. */
function scrambleFrame(from, to, p) {
  const n = Math.max(from.length, to.length);
  let out = "";
  for (let i = 0; i < n; i++) {
    const start = (i / n) * 0.75;
    const settle = start + 0.25;
    if (p >= settle) out += to[i] || "";
    else if (p >= start) out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
    else out += from[i] || "";
  }
  return out;
}

/*
  A dot drops in, stretches into the "I" of the first word while the
  other letters fly into place, then the word scrambles into the second word.
  onReveal fires when the screen starts to fade (the page underneath wakes up),
  onDone fires when the overlay is gone.
*/
export default function Intro({ first, second, onReveal, onDone }) {
  const root = useRef(null);
  const dot = useRef(null);
  const letters = useRef(null);
  const solid = useRef(null);
  const tlRef = useRef(null);
  const finished = useRef(false);
  const cb = useRef({ onReveal, onDone });
  cb.current = { onReveal, onDone };

  useLayoutEffect(() => {
    const spans = Array.from(letters.current.querySelectorAll(".intro__ltr"));
    const iIndex = first.toUpperCase().lastIndexOf("I");
    const others = spans.filter((_, i) => i !== iIndex);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fontSize = parseFloat(getComputedStyle(letters.current).fontSize);

    let dx = 0;
    let dy = 0;
    let barW = Math.max(6, fontSize * 0.13);
    let barH = fontSize * 0.7;
    if (iIndex >= 0) {
      const r = spans[iIndex].getBoundingClientRect();
      dx = r.left + r.width / 2 - vw / 2;
      dy = r.top + r.height / 2 - vh / 2;
    } else {
      // no "I" in the word: the dot stretches into an underline instead
      barW = letters.current.getBoundingClientRect().width;
      barH = Math.max(4, fontSize * 0.035);
      dy = fontSize * 0.62;
    }

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      try { sessionStorage.setItem("intro-seen", "1"); } catch (e) { /* private mode */ }
      cb.current.onDone && cb.current.onDone();
    };

    const ctx = gsap.context(() => {
      gsap.set(dot.current, { xPercent: -50, yPercent: -50, y: -vh * 0.6, opacity: 1 });
      gsap.set(spans, { opacity: 0 });
      gsap.set(solid.current, { opacity: 0 });

      const state = { p: 0 };
      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl
        // the dot falls, squashes, bounces once
        .to(dot.current, { y: 0, duration: 0.8, ease: "power2.in" }, 0.15)
        .to(dot.current, { scaleX: 1.6, scaleY: 0.55, duration: 0.07, ease: "none" })
        .to(dot.current, { scaleX: 1, scaleY: 1, y: -vh * 0.09, duration: 0.28, ease: "power2.out" })
        .to(dot.current, { y: 0, duration: 0.26, ease: "power2.in" })
        // the dot stretches into an upright bar
        .to(dot.current, { width: barW, height: barH, borderRadius: 2, duration: 0.5, ease: "power3.inOut" }, "+=0.12")
        // the other letters fly in; the bar slides to its slot
        .fromTo(
          others,
          {
            opacity: 0,
            x: () => gsap.utils.random(-vw * 0.25, vw * 0.25),
            y: () => gsap.utils.random(-vh * 0.2, vh * 0.2),
            rotation: () => gsap.utils.random(-110, 110),
            scale: 0.5,
            filter: "blur(10px)",
          },
          {
            opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, filter: "blur(0px)",
            duration: 1.05, ease: "back.out(1.5)",
            stagger: { each: 0.07, from: "random" },
          },
          "<+0.15"
        )
        .to(dot.current, { x: dx, y: dy, duration: 0.95, ease: "power3.inOut" }, "<")
        .add(() => { if (iIndex >= 0) gsap.set(spans[iIndex], { opacity: 1 }); })
        .to(dot.current, { opacity: 0, duration: iIndex >= 0 ? 0.01 : 0.35 })
        .to({}, { duration: 0.55 })
        // swap to one text node and scramble into the second word
        .add(() => {
          gsap.set(letters.current, { opacity: 0 });
          gsap.set(solid.current, { opacity: 1 });
          solid.current.textContent = first;
        })
        .to(state, {
          p: 1.02, duration: 1.4, ease: "none",
          onUpdate: () => { solid.current.textContent = scrambleFrame(first, second, state.p); },
        })
        .to({}, { duration: 0.65 })
        // dust takes over: wake the page underneath and fade the overlay out
        .add(() => cb.current.onReveal && cb.current.onReveal())
        .to(root.current, { opacity: 0, duration: 1.0, ease: "power1.inOut" }, "<")
        .to(solid.current, { scale: 1.04, duration: 1.0 }, "<");
    }, root);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [first, second]);

  const skip = () => {
    const tl = tlRef.current;
    if (tl) {
      tl.kill();
    }
    cb.current.onReveal && cb.current.onReveal();
    gsap.to(root.current, {
      opacity: 0, duration: 0.45,
      onComplete: () => {
        if (!finished.current) {
          finished.current = true;
          try { sessionStorage.setItem("intro-seen", "1"); } catch (e) { /* private mode */ }
          cb.current.onDone && cb.current.onDone();
        }
      },
    });
  };

  return (
    <div className="intro" ref={root} role="dialog" aria-label="Intro animation">
      <div className="intro__dot" ref={dot} />
      <h1 className="intro__word" aria-label={first}>
        <span className="intro__letters" ref={letters} aria-hidden="true">
          {first.split("").map((c, i) => (
            <span key={i} className="intro__ltr">{c}</span>
          ))}
        </span>
        <span className="intro__solid" ref={solid} aria-hidden="true" />
      </h1>
      <button className="intro__skip" onClick={skip}>Skip intro</button>
    </div>
  );
}
