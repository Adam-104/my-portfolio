import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

export default function NotFound() {
  return (
    <div className="page page--center">
      <h1 className="page__code chrome">404</h1>
      <p>That page doesn't exist.</p>
      <Link className="btn btn--primary" to="/">Back to the portfolio</Link>
    </div>
  );
}
