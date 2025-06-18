import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./CheckCalendar.css";

export const CheckCalendar = ({
  selectedDays,
  toggleDay,
  isSelectedDays,
  gameDays,
  selectedTeam,
}) => {
  return (
    <div>
      <DatePicker
        inline
        onChange={toggleDay}
        highlightDates={selectedDays}
        filterDate={(date) =>
          gameDays.some(
            (d) => new Date(d).toDateString() === date.toDateString()
          )
        }
        dayClassName={(date) =>
          isSelectedDays(date) ? `${selectedTeam.teamName}` : "undefined"
        }
      />
      <h3>選択中の日付：</h3>
      <ul>
        {selectedDays.map((date) => (
          <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};
