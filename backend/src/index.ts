import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
console.log("backend started");

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log("new connection: ");
  gameManager.addUser(ws)
  ws.on('disconnect', ()=>gameManager.removeUser(ws))
});