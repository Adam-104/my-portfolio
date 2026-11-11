import React, { useRef } from "react";
import Terminal from "./Terminal";
import useInView from "../lib/useInView";
import ScrollText from "./ScrollText";
import { about, path, pathExtras, terminal } from "../portfolio";
import "./About.css";

export default function About() {
  const termRef = useRef(null);
  const termOn = useInView(termRef);
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <h2 id="about-title" className="about__title chrome">{about.title}</h2>
      <div className="about__body">
        <div className="panel about__card">
          <ScrollText text={about.text} className="about__text" />
        </div>
        <div className="panel about__term" ref={termRef} style={{ minHeight: `${terminal.length * 2.55 + 2.6}em` }}>
          <Terminal lines={terminal} active={termOn} />
        </div>
        <ol className="about__path">
          {path.map((p) => (
            <li key={p.title} className="panel about__step">
              <span className="about__when">{p.when}</span>
              <div>
                <h3>{p.title}</h3>
                <p className="about__where">{p.where}</p>
                <p className="about__note">{p.note}</p>
              </div>
            </li>
          ))}
        </ol>
        <dl className="about__extras">
          {pathExtras.map((x) => (
            <div key={x.term}>
              <dt>{x.term}</dt>
              <dd>{x.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
