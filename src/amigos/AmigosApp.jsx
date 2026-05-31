import { useAmigos } from "./AmigosStore.jsx";
import AmigosSetup from "./screens/AmigosSetup.jsx";
import AmigosGameScreen from "./screens/AmigosGameScreen.jsx";
import AmigosResult from "./screens/AmigosResult.jsx";
import Colophon from "../components/Colophon.jsx";
import GameTopBar from "../components/GameTopBar.jsx";
import "./amigos.css";

export default function AmigosApp() {
  const { state } = useAmigos();
  return (
    <div className="amigos-root">
      <GameTopBar />
      {state.screen === "setup" && <AmigosSetup />}
      {state.screen === "game" && <AmigosGameScreen />}
      {state.screen === "result" && <AmigosResult />}
      <Colophon />
    </div>
  );
}
