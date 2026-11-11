import React, { useEffect, useState } from "react";
import Intro from "../components/Intro";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import BreakGame from "../components/BreakGame";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { greeting, settings } from "../portfolio";
import useReducedMotion from "../lib/useReducedMotion";
import "../components/Extras.css";

function introAlreadySeen() {
  try { return sessionStorage.getItem("intro-seen") === "1"; } catch (e) { return false; }
}

export default function Home() {
  const reduced = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => settings.isIntro && !reduced && !introAlreadySeen());
  const [awake, setAwake] = useState(!showIntro);

  // fade/slide sections in as they scroll into view; titles get a left-to-right wipe
  useEffect(() => {
    if (reduced) return undefined;
    const sel = ".about__card, .about__term, .about__step, .about__extras, .project, .contact__lead, .contact__card, .play__stage";
    const titles = document.querySelectorAll(".about__title, .skills__title, .projects__title, .play__title, .contact__title");
    const items = document.querySelectorAll(sel);
    // a clipped title can't report that it is visible, so titles are revealed
    // when the section that contains them scrolls into view
    const targets = new Map();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (targets.get(e.target) || [e.target]).forEach((el) => el.classList.add("rv--in"));
        io.unobserve(e.target);
      }),
      { threshold: 0.12 }
    );
    titles.forEach((el) => {
      el.classList.add("rv-title");
      const host = el.closest("section") || el;
      targets.set(host, [...(targets.get(host) || []), el]);
    });
    targets.forEach((_, host) => io.observe(host));
    items.forEach((el) => { el.classList.add("rv"); io.observe(el); });
    return () => io.disconnect();
  }, [reduced]);

  return (
    <>
      <Nav ready={awake} />
      <main>
        <Hero awake={awake} />
        <About />
        <Skills />
        <Projects />
        <BreakGame />
        <Contact />
      </main>
      <Footer />
      {showIntro && (
        <Intro
          first={greeting.introWord}
          second={greeting.heroWord}
          onReveal={() => setAwake(true)}
          onDone={() => setShowIntro(false)}
        />
      )}
    </>
  );
}
