import React from "react";
import { greeting } from "../portfolio";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {greeting.name}</span>
      <a href="https://github.com/ashutosh1919/masterPortfolio" target="_blank" rel="noopener noreferrer">
        Built from the masterPortfolio template (MIT)
      </a>
    </footer>
  );
}
