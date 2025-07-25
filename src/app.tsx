import { useEffect, useState } from "react";
import fundo from "./assets/CORONA.png"; // imagem de fundo com as duas garrafas

type Player = {
  id: number;
  key: string;
  clicks: number;
  finished: boolean;
  finishTime: number | null;
};

const MAX_CLICKS = 25;

const playersConfig: Player[] = [
  { id: 1, key: "r", clicks: 0, finished: false, finishTime: null },
  { id: 2, key: "t", clicks: 0, finished: false, finishTime: null },
];

export function App() {
  const [players, setPlayers] = useState(playersConfig);
  const [startTime] = useState<number | null>(Date.now());
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
  const handleKeyUp = (e: KeyboardEvent) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (e.key === player.key && !player.finished) {
          const newClicks = player.clicks + 1;
          const isFinished = newClicks === MAX_CLICKS;
          const finishedAt =
            isFinished && !player.finishTime && startTime
              ? Date.now() - startTime
              : player.finishTime;

          if (isFinished) {
            setShowRanking(true);
          }

          return {
            ...player,
            clicks: newClicks,
            finished: isFinished,
            finishTime: finishedAt,
          };
        }
        return player;
      })
    );
  };

  window.addEventListener("keyup", handleKeyUp);
  return () => window.removeEventListener("keyup", handleKeyUp);
}, [startTime]);


  if (showRanking) {
    const ranking = [...players].sort((a, b) => {
      if (a.finished && b.finished) {
        return (a.finishTime ?? 999999) - (b.finishTime ?? 999999);
      }
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.clicks - a.clicks;
    });
    function reloadPage() {
      window.location.reload();
    }

    return (
      <div className="h-screen flex flex-col justify-center items-center bg-[#1e293b] text-white text-xl text-center px-4">
        <h1 className="text-3xl font-bold mb-6">🏆 Ranking Final</h1>
        {ranking.map((player, index) => (
          <p key={player.id}>
            {index + 1}º lugar: Garrafa {player.id}
          </p>
        ))}
        <button onClick={reloadPage} className="mt-6 bg-yellow-500 text-white font-bold px-4 py-2 rounded">Jogar novamente</button>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      {/* Garrafa 1 (esquerda) */}
      <div className="absolute bottom-[15%] left-[20%] w-[150px] h-[450px] overflow-hidden">
        <div
          className="absolute bottom-0 w-full bg-yellow-400/80 rounded-t-md"
          style={{ height: `${(players[0].clicks / MAX_CLICKS) * 100}%` }}
        />
      </div>

      {/* Garrafa 2 (direita) */}
      <div className="absolute bottom-[15%] right-[20%] w-[150px] h-[450px] overflow-hidden">
        <div
          className="absolute bottom-0 w-full bg-yellow-400/80 rounded-t-md"
          style={{ height: `${(players[1].clicks / MAX_CLICKS) * 100}%` }}
        />
      </div>

      {/* Informações dos jogadores */}
      <div className="absolute bottom-[8%] w-full flex justify-around px-10 text-white text-center text-sm font-medium">
        {players.map((player) => (
          <div key={player.id}>
            <p>Jogador {player.id}</p>
            <p>Tecla: {player.key.toUpperCase()}</p>
          </div>
        ))}
      </div>
      <img
        src={fundo}
        alt="mask"
        className="absolute top-0 left-0 w-full h-full object-contain z-50 pointer-events-none"
      />
    </div>
  );
}
