import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Result } from "./pages/Result/Result";
import { SelectedDaysProvider } from "./contexts/SelectedDaysContext";
import { GameResultsProvider } from "./contexts/GameResultsContext";
import { SelectedTeamProvider } from "./contexts/SelectedTeamContext";

function App() {
  return (
    <div className="App">
      <SelectedDaysProvider>
        <SelectedTeamProvider>
          <GameResultsProvider>
            <BrowserRouter basename="/baseball_stats">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/result" element={<Result />} />
              </Routes>
            </BrowserRouter>
          </GameResultsProvider>
        </SelectedTeamProvider>
      </SelectedDaysProvider>
    </div>
  );
}

export default App;
