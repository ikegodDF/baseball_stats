import React, { createContext, useContext, useState } from "react";
import { useSelectedDays } from "./SelectedDaysContext";

const GameResultsContext = createContext();

export const useGameResults = () => {
  const context = useContext(GameResultsContext);
  if (!context) {
    throw new Error("useGameResults must be used within a GameResultsProvider");
  }
  return context;
};

export const GameResultsProvider = ({ children }) => {
  const [gameResults, setGameResults] = useState([]);

  const fetchGameResults = async () => {
    // 本番用のAPI叩き

    // テスト用API(スクレイピングでデータ取得)
    const response = await fetch("http://localhost:3000/api/game_results");
    const data = await response.json();
    setGameResults(data);
  };

  const value = {
    gameResults,
    fetchGameResults,
  };

  return (
    <GameResultsContext.Provider value={value}>
      {children}
    </GameResultsContext.Provider>
  );
};
