import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="landing">
        <div className="bg-background w-full h-screen flex items-center justify-center">
          <div className="grid grid-cols-12 gap-4 justify-items-center w-full">
            <div className="col-span-8 flex flex-col justify-center items-center p-3">
              <div className="relative">
                <img
                  className="object-cover h-96 w-auto rounded-md"
                  src="/chess.jpeg"
                  alt="chess"
                  style={{ filter: "brightness(70%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">Play Chess</h2>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex flex-col w-96 items-center border rounded-lg p-6 bg-white shadow-md">
              <h1 className="text-4xl font-bold text-center mb-6">
                Start Game
              </h1>
              <div className="flex flex-col justify-center items-center w-full">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="default-input"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Enter Name
                  </label>
                  <input
                    type="text"
                    id="default-input"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
                <button
                  onClick={() => navigate("/game")}
                  type="button"
                  className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                >
                  Go to Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
