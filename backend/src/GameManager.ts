import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME } from "./messages";

export class GameManager {
  private games: Game[];
  private pandingUser: WebSocket | null;
  private users: WebSocket[];
  constructor() {
    this.games = [];
    this.users = [];
    this.pandingUser = null;
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
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if(this.pandingUser){
            //start game
            const game = new Game(socket,this.pandingUser);
            this.games.push(game);
            this.pandingUser = null;
        }else{
            this.pandingUser = socket;
        }
      }
    });
  }
}
