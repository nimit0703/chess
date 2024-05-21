import { Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE } from "../views/Game";

export const ChessBoard = ({
  board,
  socket
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  useEffect(() => {
    if (from) {
      const handleMove = (move: { from: Square; to: Square }) => {
        socket.send(JSON.stringify({ type: MOVE, move }));
        setFrom(null);
      };

      const handleSquareClick = (square: Square | null) => {
        if (from && square) {
          handleMove({ from, to: square });
        } else {
          setFrom(square);
        }
      };

      // Adding event listener to handle clicks
      const squares = document.querySelectorAll('.chess-square');
      squares.forEach((square) => {
        square.addEventListener('click', () => handleSquareClick(square.dataset.square));
      });

      // Cleanup event listeners on unmount
      return () => {
        squares.forEach((square) => {
          square.removeEventListener('click', () => handleSquareClick(square.dataset.square));
        });
      };
    }
  }, [from, socket]);

  return (
    <div className="text-white">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              className={`chess-square w-16 h-16 ${ (i + j) % 2 === 0 ? "bg-gray-800" : "bg-gray-500" }`}
              data-square={square?.square}
            >
              <div className="w-full justify-center flex h-full">
                <div className="h-full justify-center flex flex-col">
                  {square?.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
