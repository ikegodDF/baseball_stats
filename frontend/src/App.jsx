import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Result } from "./pages/Result/Result";
import { SelectedDaysProvider } from "./contexts/SelectedDaysContext";

function App() {
  return (
    <div className="App">
      <SelectedDaysProvider>
        <BrowserRouter basename="/baseball_stats">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </BrowserRouter>
      </SelectedDaysProvider>
    </div>
  );
}

export default App;
