/* eslint-disable no-case-declarations */
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Chess } from "chess.js";
import { ChessBoard } from "../components/ChessBoard";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const ERROR = "error";

export const Game = () => {
  const socket = useWebSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [moves, setMoves] = useState([]);
  const [showMoves, setShowMoves] = useState(false);
  const [color, sendColor] = useState<string>("");
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          console.log("game init", message);
          sendColor(message.payload.color);
          setBoard(chess.board());
          setMoves([]);
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          setMoves((prevMoves) => [...prevMoves, move]);
          console.log("move");
          break;
        case GAME_OVER:
          console.log("game over");
          alert("game over")
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

  return (
    <>
      <div className="bg-gray-600 w-full h-screen">
        <div className="grid grid-cols-12 gap-4 justify-items-center">
          <div className="col-span-9 flex flex-col justify-center items-center p-3">
            <p className="text-white">board</p>
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
            />
            <div className="mt-4">
              <p className="text-gray-200 flex justify-center items-center">
                <span className="mr-2 text-lg font-bold tracking-widest">You're: {color}</span>
                <img
                  className="w-6"
                  src={`/${color === "black" ? "k.png" : "K copy.png"}`}
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
                    <th className="border border-gray-300 px-4 py-2">
                      Move From
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Move To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map(
                    (
                      move: {
                        from: string;
                        to: string;
                      },
                      index
                    ) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {move.from}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
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
