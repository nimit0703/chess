import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { ERROR, GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket ;
    private board: Chess;
    private moves: string[];
    private starttime: Date;
    private moveCounter = 0;
    
    constructor(player1:WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves=[];
        this.starttime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }))
        
    }
    addMove(socket: WebSocket, move: { from: string; to: string }) {
        // Ensure the correct player is making the move
        if (this.moveCounter % 2 === 0 && socket !== this.player1) {
            console.log("Not your turn, Player 1's turn.");
            socket.send(JSON.stringify({
                type: ERROR,
                message: "It's not your turn. Please wait for your opponent."
            }));
            return;
        } 
        if (this.moveCounter % 2 === 1 && socket !== this.player2) {
            console.log("Not your turn, Player 2's turn.");
            socket.send(JSON.stringify({
                type: ERROR,
                message: "It's not your turn. Please wait for your opponent."
            }));
            return;
        }
    
        // Try making the move on the board
        const moveResult = this.board.move(move);
        if (!moveResult) {  // Check if the move was invalid
            socket.send(JSON.stringify({
                type: ERROR,
                message: "Invalid move",
                move: move
            }));
            return;
        }
    
        // Check for game over condition
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner
            }));
            return;
        }
    
        // Notify the other player of the valid move
        const opponent = this.moveCounter % 2 === 0 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    
        this.moveCounter++;
        console.log("Move made:", this.board.ascii());
        console.log("Current turn:", this.board.turn());
    }
    
}