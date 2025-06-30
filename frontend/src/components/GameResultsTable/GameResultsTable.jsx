import React, { useState, useEffect } from "react";
import { useSelectedDays } from "../../contexts/SelectedDaysContext";
import { useGameResults } from "../../contexts/GameResultsContext";

export const GameResultsTables = () => {
  const { selectedDays } = useSelectedDays();
  const { gameResults } = useGameResults();

  return (
    <div>
      <div>
        <h1>Game Results</h1>
      </div>
    </div>
  );
};
