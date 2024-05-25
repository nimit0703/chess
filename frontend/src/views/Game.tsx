/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Chess, Square } from "chess.js";
import { ChessBoard } from "../components/ChessBoard";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const ERROR = "error";
interface Move {
  from: string;
  to: string;
}
export const Game = () => {
  const socket = useWebSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [moves, setMoves] = useState<Move[]>([]);
  const [showMoves, setShowMoves] = useState(false);
  const [color, setColor] = useState<string>("");
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          console.log("game init", message);
          setColor(message.payload.color);
          setBoard(chess.board());
          setMoves([]);
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          setMoves((prevMoves) => [...prevMoves, move]);
          setLastMove(move)
          console.log("move");
          break;
        case GAME_OVER:
          console.log("game over");
          alert("game over "+ message.winner +"is winer")
          break;
        case ERROR:
          console.log("error",message);
          alert("Invalid move")
          chess.undo();
          setBoard(chess.board());
          break;
        default:
          console.error("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  if (!socket) return <div>Connecting..</div>;

  const handleInitGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  const toggleMoves = () => {
    setShowMoves((prevShowMoves) => !prevShowMoves);
  };
  const lastMoves = moves.slice(-15).reverse();
  return (
    <>
      <div className="bg-gray-600 w-full h-screen">
        <div className="grid grid-cols-12 gap-4 justify-items-center">
          <div className="col-span-9 flex flex-col justify-center items-center p-3">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
              color={color}
              lastMove={lastMove as Move}
              setLastMove={setLastMove}
            />
            <div className="mt-4">
              <p className="text-gray-200 flex justify-center items-center">
                <span className="mr-2 text-lg font-bold tracking-widest">Current Turn : </span>
                <img
                  className="w-6"
                  src={`/${chess.turn() === "b" ? "k.png" : "K copy.png"}`}
                  alt="color representation"
                />
              </p>
            </div>
          </div>
          <div className="col-span-3 items-center">
            <button
              onClick={handleInitGame}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            >
              Start New Game
            </button>
            <button
              onClick={toggleMoves}
              className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded mt-2"
            >
              {showMoves ? "Hide Moves" : "Show Moves"}
            </button>
            {showMoves && (
              <table className="mt-4 border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border text-white border-gray-300 px-4 py-2">
                      Move From
                    </th>
                    <th className="border text-white border-gray-300 px-4 py-2">
                      Move To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lastMoves.map(
                    (
                      move: {
                        from: string;
                        to: string;
                      },
                      index
                    ) => (
                      <tr key={index}>
                        <td className="border text-white border-gray-300 px-4 py-2">
                          {move.from}
                        </td>
                        <td className="border text-white border-gray-300 px-4 py-2">
                          {move.to}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
