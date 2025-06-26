import React from "react";
import { useNavigate } from "react-router-dom";
import "./TransitionButton.css";

export const TransitionButton = ({ selectedDays }) => {
  const navigate = useNavigate();

  const handokeResultClick = () => {
    navigate("/result", {
      state: {
        selectedDays: selectedDays,
        from: "checkCalendar",
      },
    });
  };
  return (
    <div className="transition-button-container">
      <button
        className="transition-button"
        onClick={handokeResultClick}
        disabled={selectedDays.length === 0}
      >
        結果を見る
      </button>
    </div>
  );
};
