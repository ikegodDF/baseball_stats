import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./CheckCalendar.css";

export const CheckCalendar = ({
  selectedDays,
  toggleDay,
  isSelectedDays,
  selectedTeam,
  isGameDay,
  isHome,
}) => {
  return (
    <div>
      <DatePicker
        inline
        onChange={toggleDay}
        highlightDates={selectedDays}
        filterDate={isGameDay}
        dayClassName={(date) =>
          isSelectedDays(date)
            ? isHome(date)
              ? `${selectedTeam.teamName}-home`
              : `${selectedTeam.teamName}-away`
            : "undefined"
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
