import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelectedDays } from "../../../contexts/SelectedDaysContext";
import "./TransitionButton.css";

export const TransitionButton = () => {
  const navigate = useNavigate();
  const { selectedDays } = useSelectedDays();

  const handleResultClick = () => {
    navigate("/result", {
      state: {
        selectedDays: selectedDays,
        from: "calendar",
      },
    });
  };

  return (
    <div className="transition-button-container">
      <button
        className="transition-button"
        onClick={handleResultClick}
        disabled={selectedDays.length === 0}
      >
        試合結果を見る ({selectedDays.length}日選択中)
      </button>
    </div>
  );
};
