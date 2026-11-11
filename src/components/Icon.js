import React from "react";
import { ICONS } from "../lib/icons";

export default function Icon({ name, className }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg className={className} viewBox={icon.vb} aria-hidden="true" focusable="false">
      <path d={icon.d} fill="currentColor" />
    </svg>
  );
}
