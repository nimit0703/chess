import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];
  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }
  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.handleMessage(socket);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user != socket);
    //stope game user has leave
  }
  private handleMessage(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const messageStr = data.toString();
        // console.log("Raw message data:", messageStr);

        const message = JSON.parse(messageStr);
        // console.log("Parsed message:", message);

        if (message.type === INIT_GAME) {
          if (this.pendingUser) {
            // start game
            const game = new Game(socket, this.pendingUser);
            this.games.push(game);
            this.pendingUser = null;
          } else {
            this.pendingUser = socket;
          }
        }
      

        if (message.type === MOVE) {
          const game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          if (game) {
            game.addMove(socket, message.move);
          }
        }
      }catch (e) {
        console.log(e)
      }

    });
    
  }
}
