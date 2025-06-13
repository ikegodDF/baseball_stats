import React from "react";
export const DaySelector = ({ date, isSelected, toggleDate }) => {
  return (
    <button
      onClick={() => toggleDate(date)}
      style={{
        padding: "10px",
        backgroundColor: isSelected ? "#007bff" : "#f0f0f0",
        color: isSelected ? "white" : "black",
        borderRadius: "5px",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      {date.split("-")[2]}日
    </button>
  );
};
