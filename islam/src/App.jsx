import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./Islam";
 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>

    </BrowserRouter>
  );
}