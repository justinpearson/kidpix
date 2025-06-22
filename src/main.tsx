import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Only mount if React root exists and is visible
const reactRoot = document.getElementById("react-root");
if (reactRoot && reactRoot.style.display !== "none") {
  const root = ReactDOM.createRoot(reactRoot);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
