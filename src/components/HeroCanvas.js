import { canvasColors, getTheme } from "../lib/theme";
import React, { useEffect, useRef } from "react";

const BUCKETS = 4;

/*
  Particle portrait. White dust drifts across the screen; when `active` turns
  true the particles flow into the portrait described by the density map.
  Particles shy away from the pointer and scatter a little as you scroll.
  With no density map (or portrait={false}) it stays as drifting dust.
*/
export default function HeroCanvas({ active, portrait, densitySrc, densitySrcLight, reduced }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const startRef = useRef(null);

  useEffect(() => {
    activeRef.current = active;
    if (active && startRef.current === null) startRef.current = performance.now();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let density = null; // {data, size}
    let N = 0;
    let X, Y, VX, VY, TX, TY, DELAY, ALPHA, SIZE, HAS;
    const mouse = { x: -9999, y: -9999 };
    let scrollFade = 0;

    const sampleTargets = () => {
      // fill TX/TY from the density map; particles with no target stay dust
      const narrow = W < 760;
      const light = getTheme() === "light";
      const size = narrow ? Math.min(W * 1.02, H * 0.64) : Math.min(H * 1.04, W * 0.66);
      const ox = (narrow ? W / 2 : W * 0.6) - size / 2;
      const oy = narrow ? H * 0.09 : H * 0.02;
      for (let i = 0; i < N; i++) {
        if (!density) { HAS[i] = 0; continue; }
        let tries = 0;
        let u = 0;
        let v = 0;
        let d = 0;
        while (tries++ < 60) {
          u = Math.random();
          v = Math.random();
          const px = Math.min(density.size - 1, (u * density.size) | 0);
          const py = Math.min(density.size - 1, (v * density.size) | 0);
          d = density.data[py * density.size + px] / 255;
          // light mode: stretch the levels (lift the black point, expand the mid-tones)
          // so eyes, brows, nose and mouth get clearly more dots than skin
          const dl = light ? Math.min(1, Math.max(0, (d - 0.08) / 0.8)) : d;
          if (Math.random() < (light ? Math.pow(dl, 0.9) + 0.03 : d * d) + 0.02 && d > 0.05) break;
          d = 0;
        }
        if (d === 0) { HAS[i] = 0; continue; }
        HAS[i] = 1;
        TX[i] = ox + u * size;
        TY[i] = oy + v * size;
        if (light) {
          const dl = Math.min(1, Math.max(0, (d - 0.08) / 0.8));
          ALPHA[i] = Math.min(1, 0.5 + dl * 0.5); // lands in the two darkest buckets
          SIZE[i] = 1.4 + dl * 0.75; // darker areas get bigger dots, but capped so eyes stay crisp
        } else {
          ALPHA[i] = Math.min(1, 0.25 + d * 0.9);
        }
      }
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = W < 760;
      const light = getTheme() === "light";
      // dark ink on a light page needs more, crisper dots to hold the likeness
      const portraitCount = portrait && density ? (light ? (narrow ? 14500 : 34000) : (narrow ? 5200 : 10500)) : 0;
      // same drifting dust as dark mode, so the free-floating movement feels identical
      const dustCount = narrow ? 700 : 1600;
      const next = portraitCount + dustCount;
      const grow = (old) => { const a = new Float32Array(next); if (old) a.set(old.subarray(0, Math.min(old.length, next))); return a; };
      const had = N;
      N = next;
      X = grow(X); Y = grow(Y); VX = grow(VX); VY = grow(VY);
      TX = grow(TX); TY = grow(TY); DELAY = grow(DELAY); ALPHA = grow(ALPHA); SIZE = grow(SIZE);
      HAS = new Uint8Array(next);
      for (let i = 0; i < N; i++) {
        if (i >= had) {
          X[i] = Math.random() * W;
          Y[i] = Math.random() * H;
          VX[i] = (Math.random() - 0.5) * 0.4;
          VY[i] = (Math.random() - 0.5) * 0.4;
        }
        DELAY[i] = Math.random() * 1.3;
        // dust uses the same brightness spread and dot sizes as dark mode (portrait dots
        // are overridden per-particle in sampleTargets)
        ALPHA[i] = 0.25 + Math.random() * 0.6;
        SIZE[i] = Math.random() < 0.12 ? 1.9 : 1.15;
      }
      // dust particles come last and never get targets
      const targetsFor = portraitCount;
      const savedN = N;
      N = targetsFor;
      sampleTargets();
      N = savedN;
      for (let i = targetsFor; i < N; i++) HAS[i] = 0;
      if (reduced) {
        for (let i = 0; i < N; i++) if (HAS[i]) { X[i] = TX[i]; Y[i] = TY[i]; }
        draw();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const isLight = getTheme() === "light";
      // light mode: near-black ink and a steeper alpha ramp; dust (low buckets) stays faint,
      // portrait dots (top two buckets) are close to solid
      const fg = isLight ? "12,12,14" : canvasColors().fg;
      const LIGHT_ALPHA = [0.3, 0.6, 0.9, 1];
      for (let b = 0; b < BUCKETS; b++) {
        const lo = b / BUCKETS;
        const hi = (b + 1) / BUCKETS;
        ctx.fillStyle = `rgba(${fg},${(isLight ? LIGHT_ALPHA[b] : 0.28 + (b / (BUCKETS - 1)) * 0.72).toFixed(2)})`;
        for (let i = 0; i < N; i++) {
          const a = ALPHA[i];
          if (a < lo || a >= hi + (b === BUCKETS - 1 ? 1 : 0)) continue;
          const s = SIZE[i];
          ctx.fillRect(X[i] - s / 2, Y[i] - s / 2, s, s);
        }
      }
    };

    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const t = startRef.current === null ? -1 : (now - startRef.current) / 1000;
      const R = 110;
      const R2 = R * R;
      const spread = scrollFade;
      for (let i = 0; i < N; i++) {
        let x = X[i];
        let y = Y[i];
        let vx = VX[i];
        let vy = VY[i];
        const homing = HAS[i] && t >= DELAY[i];
        if (homing) {
          const k = Math.min(1, (t - DELAY[i]) / 1.8);
          const pull = 0.012 * k * (1 - spread);
          vx += (TX[i] - x) * pull * dt;
          vy += (TY[i] - y) * pull * dt;
          vx *= Math.pow(0.9, dt);
          vy *= Math.pow(0.9, dt);
          // tiny shimmer so the portrait feels alive
          vx += (Math.random() - 0.5) * 0.06;
          vy += (Math.random() - 0.5) * 0.06;
        } else {
          vx += (Math.random() - 0.5) * 0.05 * dt;
          vy += (Math.random() - 0.5) * 0.05 * dt;
          vx *= Math.pow(0.985, dt);
          vy *= Math.pow(0.985, dt);
        }
        if (spread > 0) {
          vx += (Math.random() - 0.5) * 0.7 * spread;
          vy += (Math.random() - 0.5) * 0.7 * spread - 0.05 * spread;
        }
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 2.6 * dt;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
        x += vx * dt;
        y += vy * dt;
        if (!homing) {
          if (x < -4) x = W + 4; else if (x > W + 4) x = -4;
          if (y < -4) y = H + 4; else if (y > H + 4) y = -4;
        }
        X[i] = x; Y[i] = y; VX[i] = vx; VY[i] = vy;
      }
      draw();
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      mouse.x = p.clientX - r.left;
      mouse.y = p.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onScroll = () => {
      const r = canvas.getBoundingClientRect();
      scrollFade = Math.max(0, Math.min(1, -r.top / (H * 0.7)));
      canvas.style.opacity = String(1 - scrollFade * 0.85);
    };
    const onResize = () => build();

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let cancelled = false;
    const start = () => {
      build();
      if (!reduced) raf = requestAnimationFrame(frame);
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    };

    const densities = {};
    const srcFor = (theme) => (theme === "light" && densitySrcLight ? densitySrcLight : densitySrc);
    const loadDensity = (src, cb) => {
      if (densities[src]) { cb(densities[src]); return; }
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = c.height = img.width;
        const cx = c.getContext("2d");
        cx.drawImage(img, 0, 0);
        const px = cx.getImageData(0, 0, c.width, c.height).data;
        const data = new Uint8Array(c.width * c.height);
        for (let i = 0; i < data.length; i++) data[i] = px[i * 4];
        densities[src] = { data, size: c.width };
        cb(densities[src]);
      };
      img.onerror = () => cb(null);
      img.src = src;
    };

    let started = false;
    const startOnce = () => { if (!started) { started = true; start(); } };
    const usePortrait = portrait && densitySrc;
    if (usePortrait) {
      loadDensity(srcFor(getTheme()), (dd) => { if (cancelled) return; density = dd; startOnce(); });
    } else {
      startOnce();
    }

    // switching theme swaps the density map; the particles flow into the new portrait
    const onTheme = () => {
      if (!usePortrait) { if (reduced) draw(); return; }
      loadDensity(srcFor(getTheme()), (dd) => {
        if (cancelled) return;
        density = dd;
        if (started) build();
      });
    };
    window.addEventListener("themechange", onTheme);

    return () => {
      cancelled = true;
      window.removeEventListener("themechange", onTheme);
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [portrait, densitySrc, densitySrcLight, reduced]);

  useEffect(() => {
    if (reduced) startRef.current = performance.now() - 5000;
  }, [reduced]);

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />;
}
