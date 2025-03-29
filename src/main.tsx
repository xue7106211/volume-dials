import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VolumeDial } from "./components/VolumeDial/VolumeDial";
import "./styles/global.scss";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <main className="main">
      <VolumeDial ticks={31} color="blue" />
      <VolumeDial volume={0.5} ticks={16} color="green" />
      <VolumeDial volume={0.2} ticks={10} color="red" />
    </main>
  </StrictMode>
); 