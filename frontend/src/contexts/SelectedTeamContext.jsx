import { createContext, useContext, useState } from "react";

const SelectedTeamContext = createContext();

export const useSelectedTeam = () => {
  const context = useContext(SelectedTeamContext);
  if (!context) {
    throw new Error(
      "useSelectedTeam must be used within a SelectedTeamProvider"
    );
  }
  return context;
};

export const SelectedTeamProvider = ({ children }) => {
  const [selectedTeamId, setSelectedTeamId] = useState(1);

  const value = {
    selectedTeamId,
    setSelectedTeamId,
  };

  return (
    <SelectedTeamContext.Provider value={value}>
      {children}
    </SelectedTeamContext.Provider>
  );
};
