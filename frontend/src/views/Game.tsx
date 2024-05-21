import useWebSocket from "../hooks/useWebSocket";

export const Game = () => {
    const { messages, isOpen, sendMessage } = useWebSocket();

    const handleClick = () => {
        sendMessage('Hello WebSocket!');
      };
    return (
      <>
        <h1 className="text-center text-black">Chess dom com</h1>
        <div className="grid grid-cols-12 gap-4 justify-items-center">
          <div className="col-span-9 flex flex-col justify-center items-center p-3">
            <p>chess board</p>
          </div>
          <div className="col-span-3  items-center">
            <button 
              onClick={handleClick}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              Button
            </button>
            {isOpen ? <p>WebSocket is open</p> : <p>WebSocket is closed</p>}

          </div>
        </div>
      </>
    );
  };
  