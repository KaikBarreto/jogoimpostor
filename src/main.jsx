import React from "react";
import ReactDOM from "react-dom/client";
import AppShell from "./shell/AppShell.jsx";
import "./index.css";

// Register the service worker for PWA / offline support.
// With `registerType: "autoUpdate"` in vite.config.js, new versions are
// installed and activated silently — users get the update on the next visit.
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
