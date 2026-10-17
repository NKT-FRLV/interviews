import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../i";
import "../i.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
