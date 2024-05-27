import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const PORT = parseInt(process.env.PORT ?? '8080', 10);  // Use nullish coalescing to ensure a string

const wss = new WebSocketServer({ port: PORT });
console.log("backend started",PORT);

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log("new connection added: ");
  gameManager.addUser(ws)
  ws.on('disconnect', ()=>gameManager.removeUser(ws))
});