import React, { useRef, useState } from "react";
import Terminal from "./Terminal";
import CountUp from "./CountUp";
import useInView from "../lib/useInView";
import Icon from "./Icon";
import { projects, projectsSection } from "../portfolio";
import "./Projects.css";

function Laptop({ project }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const inView = useInView(ref, { threshold: 0.5 });
  const touch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const termOn = hover || (touch && inView);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 9}deg`);
    el.style.setProperty("--rx", `${-y * 7}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    setHover(false);
  };
  return (
    <div className="laptop" ref={ref} onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={onLeave}>
      <div className="laptop__lid">
        <div className="laptop__screen">
          {project.image ? (
            <img src={project.image} alt={`${project.title} ${project.italic} screenshot`} loading="lazy" />
          ) : (
            <div className="spec" aria-hidden="true">
              <span className="spec__name chrome">{project.title}</span>
              <span className="spec__sub serif-italic">{project.italic}</span>
              {project.preview && <Terminal lines={project.preview} active={termOn} className="spec__term" />}
              <ul className="spec__metrics">
                {project.metrics.map((m) => (
                  <li key={m.label}>
                    <b><CountUp value={m.value} active={inView} /></b>
                    <span>{m.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="laptop__base" />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="projects__title">{projectsSection.title}</h2>
      {projects.map((p, i) => (
        <article key={p.id} className={`project ${i % 2 ? "project--flip" : ""}`}>
          <Laptop project={p} />
          <div className="project__text">
            <p className="project__note">{p.note}</p>
            <h3 className="project__name">
              <span>{p.title}</span> <em className="serif-italic">{p.italic}</em>
            </h3>
            <p className="project__desc">{p.description}</p>
            <ul className="project__tools" aria-label="Built with">
              {p.tools.map((t) => (
                <li key={t.name} title={t.name}>
                  <Icon name={t.icon} />
                  <span>{t.name}</span>
                </li>
              ))}
            </ul>
            <div className="project__links">
              {p.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn--small ${l.primary ? "btn--primary" : ""}`}
                >
                  {l.icon && <Icon name={l.icon} />}
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
