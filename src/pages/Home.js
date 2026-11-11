import React, { useState } from "react";
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

function introAlreadySeen() {
  try { return sessionStorage.getItem("intro-seen") === "1"; } catch (e) { return false; }
}

export default function Home() {
  const reduced = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => settings.isIntro && !reduced && !introAlreadySeen());
  const [awake, setAwake] = useState(!showIntro);

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
