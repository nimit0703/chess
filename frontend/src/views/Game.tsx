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
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          console.log("game init");
          setChess(new Chess());
          setBoard(chess.board());
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("move");
          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  });

  if (!socket) return <div> Connecting..</div>;
  const handleClick = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };
  return (
    <>
      <h1 className="text-center text-black">Chess dom com</h1>
      <div className="grid grid-cols-12 gap-4 justify-items-center">
        <div className="col-span-9 flex flex-col justify-center items-center p-3">
          <p>chess board</p>
          <ChessBoard board={board} socket={socket}/>
        </div>
        <div className="col-span-3  items-center">
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Button
          </button>
        </div>
      </div>
    </>
  );
};
