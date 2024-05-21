import { useState, useEffect, useRef } from 'react';

// interface WebSocketHook {
//   messages: string[];
//   isOpen: boolean;
//   sendMessage: (message: string) => void;
// }

const URL = "ws://localhost:8080"

const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(URL);

    ws.current.onopen = () => {
      console.log('WebSocket is open now.');
      setIsOpen(true);
    };

    ws.current.onmessage = (event: MessageEvent) => {
      console.log('WebSocket message received:', event);
      setMessages(prev => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket is closed now.');
      setIsOpen(false);
    };

    ws.current.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [URL]);

  const sendMessage = (message: string) => {
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.log('WebSocket is not open. Unable to send message.');
    }
  };

  return { messages, isOpen, sendMessage };
};

export default useWebSocket;
