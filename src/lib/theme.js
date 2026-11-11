/* Light / dark theme. The choice is stored in localStorage and applied to <html data-theme>. */
export function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f3f0e8" : "#050507");
  window.dispatchEvent(new Event("themechange"));
}

/* Colours for the <canvas> drawings, read from the CSS variables. */
let cache = null;
export function canvasColors() {
  if (!cache) {
    const cs = getComputedStyle(document.documentElement);
    cache = {
      fg: cs.getPropertyValue("--fg-rgb").trim().split(/\s+/).join(","),
      red: cs.getPropertyValue("--red").trim(),
    };
  }
  return cache;
}
if (typeof window !== "undefined") window.addEventListener("themechange", () => { cache = null; });
