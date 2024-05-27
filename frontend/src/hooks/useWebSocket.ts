import { useState, useEffect } from 'react';

const URL = "wss://chess-1m2l.onrender.com";
console.log(URL);

export const useWebSocket = () => {
  const [socket,setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(URL);

    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
    return () =>{
      ws.close();
    }
  }, []);

  return socket;
};

