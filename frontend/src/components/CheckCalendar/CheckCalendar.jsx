import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelectedDays } from "../../contexts/SelectedDaysContext";

import "./CheckCalendar.css";

export const CheckCalendar = ({
  gameDays,
  selectedTeam,
  isGameDay,
  isHome,
}) => {
  const { selectedDays, toggleDay, isSelectedDays } = useSelectedDays();

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
      <div className="selected-dates-container">
        <h3>選択中の日付：</h3>
        <ul className="selected-dates-list">
          {selectedDays.map((date) => (
            <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
