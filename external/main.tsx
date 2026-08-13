import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AcquisitionApp } from "../app/AcquisitionApp";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-600.css";
import "@fontsource/roboto/latin-700.css";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AcquisitionApp />
  </StrictMode>,
);
