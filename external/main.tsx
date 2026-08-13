import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AcquisitionApp } from "../app/AcquisitionApp";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AcquisitionApp />
  </StrictMode>,
);
