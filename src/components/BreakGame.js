import React, { useCallback, useEffect, useRef, useState } from "react";
import { layoutLine, GLYPH_H } from "../lib/bitmapFont";
import { play } from "../portfolio";
import "./BreakGame.css";

const START_LIVES = 3;

export default function BreakGame() {
  const wrap = useRef(null);
  const canvasRef = useRef(null);
  const api = useRef({});
  const [lives, setLives] = useState(START_LIVES);
  const [broken, setBroken] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | playing | over | won

  const restart = useCallback(() => {
    if (api.current.reset) api.current.reset();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cell = 8;
    let bricks = [];
    let total = 0;
    let alive = 0;
    let bits = [];
    const paddle = { x: 0, w: 80, h: 8, y: 0, target: 0 };
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 4, stuck: true };
    let livesLeft = START_LIVES;
    let state = "ready";
    let keys = { left: false, right: false };
    let lastPct = -1;

    const setState = (s) => { state = s; setPhase(s); };

    const layout = () => {
      const rect = wrap.current.getBoundingClientRect();
      W = Math.max(280, rect.width);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const lines = play.lines.map(layoutLine);
      const maxCols = Math.max(...lines.map((l) => l.width));
      cell = Math.max(3, (W * 0.74) / maxCols);
      const textRows = lines.length * GLYPH_H + (lines.length - 1) * 2;
      H = Math.round(Math.max(cell * 2, 44) + cell * (textRows + 2) + Math.max(130, W * 0.2));
      canvas.style.height = `${H}px`;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const prev = bricks;
      bricks = [];
      let rowOffset = 0;
      lines.forEach((l) => {
        const ox = (W - l.width * cell) / 2;
        const oy = Math.max(cell * 2, 44) + rowOffset * cell;
        l.pixels.forEach(([c, r]) => {
          bricks.push({ x: ox + c * cell, y: oy + r * cell, alive: true });
        });
        rowOffset += GLYPH_H + 2;
      });
      total = bricks.length;
      if (prev.length === bricks.length) {
        prev.forEach((b, i) => { bricks[i].alive = b.alive; });
      }
      alive = bricks.filter((b) => b.alive).length;

      paddle.w = Math.max(64, cell * 9);
      paddle.h = Math.max(6, cell * 0.8);
      paddle.y = H - Math.max(26, cell * 2.2);
      paddle.x = Math.min(Math.max(paddle.x, 0), W - paddle.w);
      paddle.target = paddle.x;
      ball.r = Math.max(3.5, cell * 0.42);
      if (ball.stuck) stick();
    };

    const stick = () => {
      ball.stuck = true;
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 1;
    };

    const reset = () => {
      bricks.forEach((b) => { b.alive = true; });
      alive = total;
      livesLeft = START_LIVES;
      bits = [];
      setLives(START_LIVES);
      setBroken(0);
      lastPct = 0;
      paddle.x = (W - paddle.w) / 2;
      paddle.target = paddle.x;
      stick();
      setState("ready");
    };
    api.current.reset = reset;

    const launch = () => {
      if (state === "over" || state === "won") return;
      if (!ball.stuck) return;
      const speed = Math.max(260, W * 0.62);
      const a = (-Math.PI / 2) + (Math.random() - 0.5) * 0.6;
      ball.vx = Math.cos(a) * speed;
      ball.vy = Math.sin(a) * speed;
      ball.stuck = false;
      setState("playing");
    };

    const burst = (x, y) => {
      for (let i = 0; i < 4; i++) {
        bits.push({
          x, y,
          vx: (Math.random() - 0.5) * 160,
          vy: -Math.random() * 140,
          life: 1,
          s: Math.max(2, cell * 0.35),
        });
      }
    };

    let last = performance.now();
    const step = (now) => {
      raf = requestAnimationFrame(step);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      // paddle
      const keySpeed = W * 0.9;
      if (keys.left) paddle.target -= keySpeed * dt;
      if (keys.right) paddle.target += keySpeed * dt;
      paddle.target = Math.min(Math.max(paddle.target, 0), W - paddle.w);
      paddle.x += (paddle.target - paddle.x) * Math.min(1, dt * 22);

      if (ball.stuck) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 1;
      } else if (state === "playing") {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
        if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
        if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

        // paddle
        if (
          ball.vy > 0 &&
          ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r
        ) {
          const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const speed = Math.hypot(ball.vx, ball.vy);
          const a = -Math.PI / 2 + Math.max(-1, Math.min(1, hit)) * 1.05;
          ball.vx = Math.cos(a) * speed;
          ball.vy = Math.sin(a) * speed;
          ball.y = paddle.y - ball.r - 0.5;
        }

        // bricks
        for (let i = 0; i < bricks.length; i++) {
          const b = bricks[i];
          if (!b.alive) continue;
          const nx = Math.max(b.x, Math.min(ball.x, b.x + cell));
          const ny = Math.max(b.y, Math.min(ball.y, b.y + cell));
          const dx = ball.x - nx;
          const dy = ball.y - ny;
          if (dx * dx + dy * dy <= ball.r * ball.r) {
            b.alive = false;
            alive--;
            burst(b.x + cell / 2, b.y + cell / 2);
            if (Math.abs(dx) > Math.abs(dy)) ball.vx = dx > 0 ? Math.abs(ball.vx) : -Math.abs(ball.vx);
            else ball.vy = dy > 0 ? Math.abs(ball.vy) : -Math.abs(ball.vy);
            break;
          }
        }
        const pct = Math.round(((total - alive) / total) * 100);
        if (pct !== lastPct) { lastPct = pct; setBroken(pct); }
        if (alive === 0) { setState("won"); ball.stuck = true; }

        // lost the ball
        if (ball.y - ball.r > H) {
          livesLeft--;
          setLives(livesLeft);
          if (livesLeft <= 0) { setState("over"); ball.stuck = true; }
          else { stick(); setState("ready"); }
        }
      }

      for (let i = bits.length - 1; i >= 0; i--) {
        const p = bits[i];
        p.vy += 520 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 1.6;
        if (p.life <= 0) bits.splice(i, 1);
      }

      // draw
      ctx.clearRect(0, 0, W, H);
      const gap = Math.max(1, cell * 0.12);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.alive) ctx.fillRect(b.x + gap / 2, b.y + gap / 2, cell - gap, cell - gap);
      }
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      bits.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, p.s, p.s);
      });
      ctx.globalAlpha = 1;
      // paddle
      ctx.fillStyle = "#ff3d1f";
      const pr = paddle.h / 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, pr);
      else ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.fill();
      // ball
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const toLocalX = (e) => {
      const r = canvas.getBoundingClientRect();
      return e.clientX - r.left;
    };
    const onMove = (e) => { paddle.target = toLocalX(e) - paddle.w / 2; };
    const onDown = (e) => {
      paddle.target = toLocalX(e) - paddle.w / 2;
      canvas.focus({ preventScroll: true });
      launch();
    };
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") { keys.left = true; e.preventDefault(); }
      else if (e.key === "ArrowRight") { keys.right = true; e.preventDefault(); }
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); launch(); }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft") keys.left = false;
      if (e.key === "ArrowRight") keys.right = false;
    };
    const onBlur = () => { keys = { left: false, right: false }; };

    layout();
    paddle.x = (W - paddle.w) / 2;
    paddle.target = paddle.x;
    stick();
    raf = requestAnimationFrame(step);

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(canvas);
    // run layout on the next frame so resizing the canvas can't re-trigger
    // the observer inside the same frame (avoids the "ResizeObserver loop" error)
    let roRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(roRaf);
      roRaf = requestAnimationFrame(layout);
    });
    ro.observe(wrap.current);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("blur", onBlur);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(roRaf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", onBlur);
      api.current = {};
    };
  }, []);

  return (
    <section id="play" className="section play" aria-labelledby="play-title">
      <h2 id="play-title" className="play__title">{play.title}</h2>
      <p className="play__hint">{play.hint}</p>
      <div className="play__stage panel" ref={wrap}>
        <div className="play__hud" aria-live="polite">
          <span>{broken}% broken</span>
          <span className="play__lives" aria-label={`${lives} balls left`}>
            Balls
            {Array.from({ length: START_LIVES }).map((_, i) => (
              <i key={i} className={i < lives ? "on" : ""} />
            ))}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className="play__canvas"
          tabIndex={0}
          aria-label="Breakout game. Use the arrow keys or the pointer to move the paddle, space to launch."
        />
        {(phase === "over" || phase === "won") && (
          <div className="play__overlay">
            <p className="play__msg">
              {phase === "won" ? "You broke it." : "Out of balls."}
            </p>
            <p className="play__sub">
              {phase === "won" ? "That is why I write tests." : `${broken}% of the text is gone.`}
            </p>
            <button className="btn btn--primary" onClick={restart}>
              {phase === "won" ? "Rebuild" : "Try again"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
