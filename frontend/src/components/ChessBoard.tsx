/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE } from "../views/Game";

const moveSound = new Audio('/sounds/move.mp3');
const captureSound = new Audio('/sounds/capture.mp3');
const notifySound = new Audio('/sounds/notify.mp3');

export const ChessBoard = ({
  board,
  socket,
  chess,
  setBoard,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: Chess;
  setBoard: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [possibleMoves, setPossibleMoves] = useState<{ to: Square; capture: boolean }[]>([]);

  const playSound = (type: string) => {
    switch (type) {
      case 'move':
        moveSound.play();
        break;
      case 'capture':
        captureSound.play();
        break;
      case 'notify':
        notifySound.play();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (chess.isCheck()) {
      setTimeout(() => {
        playSound('notify');
      }, 1000);
    }
  }, [chess]);

  const handleMove = (from: Square, to: Square) => {
    const move = chess.move({ from, to });
    if (move) {
      if (move.flags.includes('c')) {
        playSound('capture');
      } else {
        playSound('move');
      }
      setBoard(chess.board());
      if (chess.isCheckmate() || chess.isDraw() || chess.isStalemate()) {
        playSound('notify');
      }
      socket.send(JSON.stringify({ type: MOVE, move: { from, to } }));
    } else {
      chess.undo();
    }
    setFrom(null);
    setPossibleMoves([]);
  };

  return (
    <div className="text-white">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const sqRepresntation = (String.fromCharCode(97 + (j % 8)) + (8 - i)) as Square;
            const possibleMove = possibleMoves.find(move => move.to === sqRepresntation);
            const isPossibleMove = !!possibleMove;
            const isPossibleCapture = isPossibleMove && possibleMove?.capture;

            return (
              <div
                onClick={() => {
                  if (!from) {
                    if (square?.color !== chess.turn()) {
                      return;
                    }
                    setFrom(sqRepresntation);
                    const moves = chess.moves({ square: sqRepresntation, verbose: true }).map((move: any) => ({ to: move.to, capture: move.flags.includes('c') }));
                    setPossibleMoves(moves);
                  } else {
                    if (!possibleMoves.some(move => move.to === sqRepresntation)) {
                      setFrom(null);
                      setPossibleMoves([]);
                      return;
                    }
                    handleMove(from, sqRepresntation);
                  }
                }}
                key={j}
                className={`w-16 h-16 border border-3 relative ${(i + j) % 2 == 0 ? "bg-[#769656]" : "bg-[#f8e7bb]"}`}
              >
                {isPossibleMove && (
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className={`w-10 h-10 rounded-full ${isPossibleCapture ? "bg-red-500" : "bg-yellow-500"}`}></div>
                  </div>
                )}
                <div className="w-full justify-center flex h-full relative z-10">
                  <div className="h-full justify-center flex flex-col">
                    {square ? (
                      <img
                        className="w-6"
                        src={`/${square.color === "b" ? square.type : `${square.type?.toUpperCase()} copy`}.png`}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
