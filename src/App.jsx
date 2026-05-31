import { useGame } from "./state/GameStore.jsx";
import SetupScreen from "./screens/SetupScreen.jsx";
import RevealScreen from "./screens/RevealScreen.jsx";
import GameScreen from "./screens/GameScreen.jsx";
import ResultScreen from "./screens/ResultScreen.jsx";

export default function App() {
  const { state } = useGame();
  return (
    <>
      {state.screen === "setup" && <SetupScreen />}
      {state.screen === "reveal" && <RevealScreen />}
      {state.screen === "game" && <GameScreen />}
      {state.screen === "result" && <ResultScreen />}
    </>
  );
}
