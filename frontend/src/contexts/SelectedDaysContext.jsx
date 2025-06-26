import React, { createContext, useContext, useState } from "react";

const SelectedDaysContext = createContext();

export const useSelectedDays = () => {
  const context = useContext(SelectedDaysContext);
  if (!context) {
    throw new Error(
      "useSelectedDays must be used within a SelectedDaysProvider"
    );
  }
  return context;
};

export const SelectedDaysProvider = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (date) => {
    const key = date.toDateString();
    const exists = selectedDays.find((d) => d.toDateString() === key);
    const next = exists
      ? selectedDays.filter((d) => d.toDateString() !== key)
      : [...selectedDays, date];
    setSelectedDays(next);
  };

  const isSelectedDays = (date) => {
    return selectedDays.some((d) => d.toDateString() === date.toDateString());
  };

  const clearSelectedDays = () => {
    setSelectedDays([]);
  };

  const value = {
    selectedDays,
    setSelectedDays,
    toggleDay,
    isSelectedDays,
    clearSelectedDays,
  };

  return (
    <SelectedDaysContext.Provider value={value}>
      {children}
    </SelectedDaysContext.Provider>
  );
};
