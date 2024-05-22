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
    addMove(socket: WebSocket, move: {
        from:string, to: string
    }) {

        if (this.moveCounter % 2 == 0 && socket !== this.player1){
            console.log("not your turn 1");
            
            return;
        } 
        if (this.moveCounter % 2 == 1 && socket !== this.player2){
            console.log("not your turn 2");
            return;
        }
        try {
            this.board.move(move)
        } catch (error) {
            socket.send(JSON.stringify({
                type: ERROR,
                message:"Invalid Move",
                move: move
             }))
            return;
        }

        if(this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER ,
                winner : this.board.turn() === 'w' ? 'black' : 'white'
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                winner: this.board.turn() === 'w' ? 'black' : 'white'
                
            }))
            return;
        }

        if (this.moveCounter % 2 == 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        this.moveCounter++
        console.log("inside addMove",this.board.ascii());
        console.log("turn",this.board.turn());
    }
}