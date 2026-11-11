import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Cursor from "./components/Cursor";
import { TransitionProvider } from "./components/PageTransition";

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Cursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}
