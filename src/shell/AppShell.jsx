import { createContext, useContext, useState, useMemo } from "react";
import { GameProvider } from "../state/GameStore.jsx";
import App from "../App.jsx";
import { AmigosProvider } from "../amigos/AmigosStore.jsx";
import AmigosApp from "../amigos/AmigosApp.jsx";
import HomeScreen from "../screens/HomeScreen.jsx";

const AppShellContext = createContext(null);

export function useShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useShell must be used inside <AppShell>");
  return ctx;
}

export default function AppShell() {
  const [activeGame, setActiveGame] = useState("home"); // "home" | "impostor" | "amigos"

  const value = useMemo(
    () => ({
      activeGame,
      goToGame: (g) => setActiveGame(g),
      goHome: () => setActiveGame("home"),
    }),
    [activeGame]
  );

  return (
    <AppShellContext.Provider value={value}>
      {activeGame === "home" && <HomeScreen />}
      {activeGame === "impostor" && (
        <GameProvider>
          <App />
        </GameProvider>
      )}
      {activeGame === "amigos" && (
        <AmigosProvider>
          <AmigosApp />
        </AmigosProvider>
      )}
    </AppShellContext.Provider>
  );
}
