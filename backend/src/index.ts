import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
console.log("backend started");

wss.on('connection', function connection(ws) {
  console.log("new connection: ",ws);
  
  ws.on('error', console.error);
  ws.on('message', function message(data: any) {
    console.log('received: %s', data);
  });

  ws.send('something');
});