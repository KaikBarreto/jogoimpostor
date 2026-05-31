import { useNavigate } from "react-router-dom";
import "./GameTopBar.css";

// Slim sticky bar at the top of every game with a link back to the hub.
export default function GameTopBar() {
  const navigate = useNavigate();
  return (
    <div className="game-topbar">
      <button
        type="button"
        className="game-topbar-back"
        onClick={() => navigate("/")}
      >
        ← <b>Seleção de jogos</b>
      </button>
    </div>
  );
}
