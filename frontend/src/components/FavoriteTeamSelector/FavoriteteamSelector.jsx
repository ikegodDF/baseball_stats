import React, { useState } from "react";

// コンボボックスの表示
export const FavoriteteamSelector = ({
  inputDate,
  selectedTeam,
  choiceTeam,
}) => {
  return (
    <div>
      <select
        id="team"
        value={selectedTeam?.teamId}
        onChange={(e) => choiceTeam(e.target.value)}
      >
        {inputDate.map((team) => (
          <option key={team.teamId} value={team.teamId}>
            {team.teamName}
          </option>
        ))}
      </select>
    </div>
  );
};
