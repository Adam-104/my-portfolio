import React from "react";
import { TLink } from "../components/PageTransition";
import { greeting } from "../portfolio";
import "./Pages.css";

export default function Resume() {
  return (
    <div className="page">
      <header className="page__bar">
        <TLink to="/" className="page__back">Back to portfolio</TLink>
        <a className="btn btn--small btn--primary" href={greeting.resumeLink} download>Download PDF</a>
      </header>
      <object className="page__pdf" data={greeting.resumeLink} type="application/pdf" aria-label="Resume">
        <p className="page__fallback">
          Your browser can't show the PDF here. <a href={greeting.resumeLink}>Open the resume</a>.
        </p>
      </object>
    </div>
  );
}
