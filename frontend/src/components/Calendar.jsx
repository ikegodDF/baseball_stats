import React, { useState } from "react";
import { DaySelector } from "./DaySelector";

export const Calendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);

  const toggleDate = (date) => {
    setSelectedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) =>
      `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(
        2,
        "0"
      )}`
  );

  return (
    <div>
      <h2>
        {year}年 {month + 1}月の観戦日
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {days.map((date) => (
          <DaySelector
            key={date}
            date={date}
            isSelected={selectedDates.includes(date)}
            toggleDate={toggleDate}
          />
        ))}
      </div>
      <h3>選択中の日付：</h3>
      <ul>
        {selectedDates.map((date) => (
          <li key={date}>{date}</li>
        ))}
      </ul>
    </div>
  );
};
