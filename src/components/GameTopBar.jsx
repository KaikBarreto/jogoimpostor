import { useNavigate } from "react-router-dom";
import "./GameTopBar.css";

// Slim sticky bar at the top of every game — the "A Mesa." wordmark links home.
export default function GameTopBar() {
  const navigate = useNavigate();
  return (
    <div className="game-topbar">
      <button
        type="button"
        className="game-topbar-home"
        onClick={() => navigate("/")}
        aria-label="Voltar à seleção de jogos"
      >
        A Mesa<span className="pt">.</span>
      </button>
    </div>
  );
}
