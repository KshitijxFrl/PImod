import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DirectorContext } from "./components/DirectorContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectorContext>
      <App />
    </DirectorContext>
  </StrictMode>
);
