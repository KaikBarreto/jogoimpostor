import { useEffect } from "react";
import { useAmigos } from "./AmigosStore.jsx";
import AmigosSetup from "./screens/AmigosSetup.jsx";
import AmigosGameScreen from "./screens/AmigosGameScreen.jsx";
import AmigosResult from "./screens/AmigosResult.jsx";
import "./amigos.css";

export default function AmigosApp() {
  const { state } = useAmigos();

  // Amigos is always dark "caos noturno" — force the page (body + browser UI
  // colour) dark while it's mounted, regardless of the global light/dark theme.
  useEffect(() => {
    document.body.classList.add("amigos-active");
    const meta = document.querySelector('meta[name="theme-color"]');
    const prevColor = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", "#000000");
    return () => {
      document.body.classList.remove("amigos-active");
      if (meta && prevColor) meta.setAttribute("content", prevColor);
    };
  }, []);

  return (
    <div className="ios-app ios-app--amigos">
      {state.screen === "setup" && <AmigosSetup />}
      {state.screen === "game" && <AmigosGameScreen />}
      {state.screen === "result" && <AmigosResult />}
    </div>
  );
}
