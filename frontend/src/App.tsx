import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Landing } from "./views/Landing";
import { Game } from "./views/Game";
import { Landing } from "./views/Landing";


export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/game" element={<Game/>} /> 
      </Routes>
    </BrowserRouter>
  )
}