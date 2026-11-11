import React from "react";
import HeroCanvas from "./HeroCanvas";
import { greeting, settings } from "../portfolio";
import useReducedMotion from "../lib/useReducedMotion";
import "./Hero.css";

export default function Hero({ awake }) {
  const reduced = useReducedMotion();
  return (
    <section id="home" className="hero" aria-label="Home">
      <HeroCanvas
        active={awake}
        reduced={reduced}
        portrait={settings.portrait}
        densitySrc={`${process.env.PUBLIC_URL}/portrait-density.png`}
      />
      <div className="hero__text">
        <h1 className="hero__word chrome">
          <span className="sr-only">{greeting.name}, </span>
          {greeting.heroWord}
        </h1>
        <p className="hero__role">
          <strong>{greeting.roleBold}</strong> <em className="serif-italic">{greeting.roleItalic}</em>
        </p>
      </div>
    </section>
  );
}
