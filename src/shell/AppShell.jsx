import { Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "../state/GameStore.jsx";
import App from "../App.jsx";
import { AmigosProvider } from "../amigos/AmigosStore.jsx";
import AmigosApp from "../amigos/AmigosApp.jsx";
import HomeScreen from "../screens/HomeScreen.jsx";

export default function AppShell() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route
        path="/impostor"
        element={
          <GameProvider>
            <App />
          </GameProvider>
        }
      />
      <Route
        path="/amigos"
        element={
          <AmigosProvider>
            <AmigosApp />
          </AmigosProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
