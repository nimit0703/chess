import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Landing } from "./views/Landing";
import { Game } from "./views/Game";


export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Game/>} /> 👈 Renders at /app/
        {/* <Route path="/game" element={<Game/>} /> 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  )
}