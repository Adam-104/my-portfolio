import React, { useState } from "react";
import { getTheme, setTheme } from "../lib/theme";
import "./ThemeToggle.css";

/* Flat square button: shows the sun in dark mode (switch to light) and the moon in light mode. */
export default function ThemeToggle() {
  const [theme, setLocal] = useState(getTheme);
  const next = theme === "dark" ? "light" : "dark";

  const onClick = () => {
    setTheme(next);
    setLocal(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
        </svg>
      )}
    </button>
  );
}
