import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./CheckCalendar.css";

export const CheckCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);

  const toggleDate = (date) => {
    const key = date.toDateString();
    const exists = selectedDates.find((d) => d.toDateString() === key);
    const next = exists
      ? selectedDates.filter((d) => d.toDateString() !== key)
      : [...selectedDates, date];
    setSelectedDates(next);
  };

  const isSelected = (date) => {
    return selectedDates.some((d) => d.toDateString() === date.toDateString());
  };

  return (
    <div>
      <DatePicker
        inline
        onChange={toggleDate}
        highlightDates={selectedDates}
        dayClassName={(date) =>
          isSelected(date) ? "selected-date" : "undefined"
        }
      />
      <h3>選択中の日付：</h3>
      <ul>
        {selectedDates.map((date) => (
          <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};
