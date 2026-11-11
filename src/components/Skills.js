import React, { useState } from "react";
import Icon from "./Icon";
import { skills, skillsSection, tickerWords } from "../portfolio";
import "./Skills.css";

function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__tilt">
        {tickerWords.map((row, r) => (
          <div key={r} className={`ticker__row ${r % 2 ? "ticker__row--rev" : ""}`} style={{ "--speed": `${70 + r * 18}s` }}>
            <div className="ticker__track">
              {[0, 1].map((copy) => (
                <ul key={copy}>
                  {row.map((w) => (<li key={w + copy}>{w}</li>))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [open, setOpen] = useState(0);
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <Ticker />
      <h2 id="skills-title" className="skills__title chrome">{skillsSection.title}</h2>
      <ol className="svc">
        {skills.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.title} className={`svc__item ${isOpen ? "is-open" : ""}`}>
              <button
                className="svc__row"
                aria-expanded={isOpen}
                aria-controls={`svc-panel-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="svc__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="svc__name">{s.title}</span>
                <svg className="svc__arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div id={`svc-panel-${i}`} className="svc__panel" role="region">
                <div className="svc__panel-inner">
                  <p>{s.detail}</p>
                  <ul className="svc__tools">
                    {s.tools.map((t) => (
                      <li key={t.name}><Icon name={t.icon} />{t.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
