import React from "react";
import { TLink } from "../components/PageTransition";
import "./Pages.css";

export default function NotFound() {
  return (
    <div className="page page--center">
      <h1 className="page__code chrome">404</h1>
      <p>That page doesn't exist.</p>
      <TLink className="btn btn--primary" to="/">Back to the portfolio</TLink>
    </div>
  );
}
