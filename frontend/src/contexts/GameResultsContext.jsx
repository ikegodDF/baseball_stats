import React, { createContext, useContext, useState } from "react";

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

  const fetchGameResults = async () => {};

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
