/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../views/Game";

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
  chess: any;
  setBoard: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  return (
    <>
      {/* using this board build chess board which looks like actual chess */}
      <div className="text-white ">
        {board.map((row, i) => {
          return (
            <div key={i} className="flex ">
              {row.map((square, j) => {
                const sqRepresntaion = (String.fromCharCode(97 + (j % 8)) +
                  "" +
                  (8 - i)) as Square;
                return (
                  <div
                    onClick={() => {
                      console.log(sqRepresntaion);
                      if (!from) {
                        setFrom(sqRepresntaion);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            move: {
                              from,
                              to: sqRepresntaion,
                            },
                          })
                        );
                        chess.move({
                          from,
                          to: sqRepresntaion,
                        });
                        setBoard(chess.board());
                        setFrom(null);
                      }
                    }}
                    key={j}
                    className={`w-16 h-16 border border-3 ${
                      (i + j) % 2 == 0 ? "bg-[#769656]" : "bg-[#f8e7bb]	"
                    }`}
                  >
                    <div className="w-full justify-center flex h-full">
                      
                      <div className="h-full justify-center flex flex-col">
                        {square ? (
                          <img
                            className="w-6"
                            src={`/${
                              square.color === "b"
                                ? square.type
                                : `${square.type?.toUpperCase()} copy`
                            }.png`}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
