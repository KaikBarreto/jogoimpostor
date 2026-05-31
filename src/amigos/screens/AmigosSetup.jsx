import { useNavigate } from "react-router-dom";
import { useAmigos } from "../AmigosStore.jsx";
import NavBar from "../../components/ios/NavBar.jsx";
import PlayerRoster from "../../components/PlayerRoster.jsx";

export default function AmigosSetup() {
  const { state, addPlayer, removePlayer, start } = useAmigos();
  const navigate = useNavigate();

  return (
    <>
      <NavBar back={{ label: "Jogos", onClick: () => navigate("/") }} />
      <div className="ios-scroll">
        <h1 className="ios-large-title">Amigos de Merda</h1>
        <p className="ios-lede">
          Quem é o pior da roda? Cadastre a galera e comece a apontar dedos.
        </p>
        <PlayerRoster
          players={state.players}
          onAdd={addPlayer}
          onRemove={removePlayer}
          max={16}
        />
      </div>
      <div className="ios-footer">
        <button
          type="button"
          className="ios-button"
          disabled={state.players.length < 3}
          onClick={start}
        >
          Começar
        </button>
      </div>
    </>
  );
}
