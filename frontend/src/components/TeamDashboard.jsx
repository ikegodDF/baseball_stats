import React, { useState } from "react";
import { FavoriteteamSelector } from "./FavoriteTeamSelector/FavoriteteamSelector";
import { CheckCalendar } from "./CheckCalendar/CheckCalendar";

import gamedays from "../gamedays.json";

export const TeamDashboard = () => {
  const inputDate = [
    { teamId: 1, teamName: "読売ジャイアンツ" },
    { teamId: 2, teamName: "阪神タイガース" },
    { teamId: 3, teamName: "中日ドラゴンズ" },
    { teamId: 4, teamName: "広島東洋カープ" },
    { teamId: 5, teamName: "東京ヤクルトスワローズ" },
    { teamId: 6, teamName: "横浜DeNAベイスターズ" },
    { teamId: 7, teamName: "福岡ソフトバンクホークス" },
    { teamId: 8, teamName: "埼玉西武ライオンズ" },
    { teamId: 9, teamName: "千葉ロッテマリーンズ" },
    { teamId: 10, teamName: "オリックス・バファローズ" },
    { teamId: 11, teamName: "北海道日本ハムファイターズ" },
    { teamId: 12, teamName: "東北楽天ゴールデンイーグルス" },
  ];

  // お気に入りチーム管理
  const [selectedTeamId, setSelectedTeamId] = useState(inputDate[0].teamId);

  const selectedTeam = inputDate.find(
    (team) => team.teamId === Number(selectedTeamId)
  );

  //   お気に入りチーム選択機能
  const choiceTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const gameDays = gamedays[selectedTeam.teamName] || [];

  //   観戦日管理
  const [selectedDays, setSelectedDays] = useState([]);

  //   観戦日を選択、追加する機能
  const toggleDay = (date) => {
    const key = date.toDateString();
    const exists = selectedDays.find((d) => d.toDateString() === key);
    const next = exists
      ? selectedDays.filter((d) => d.toDateString() !== key)
      : [...selectedDays, date];
    setSelectedDays(next);
  };

  //   カレンダーの日付が選択されているか判定する機能
  const isSelectedDays = (date) => {
    return selectedDays.some((d) => d.toDateString() === date.toDateString());
  };

  return (
    <div>
      <h1>お気に入りチーム</h1>
      <FavoriteteamSelector
        teamId={selectedTeamId}
        teamName={selectedTeam?.teamName}
        inputDate={inputDate}
        selectedTeam={selectedTeam}
        choiceTeam={choiceTeam}
      />
      <h1>観戦日選択</h1>
      <CheckCalendar
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        isSelectedDays={isSelectedDays}
        gameDays={gameDays}
        selectedTeam={selectedTeam}
      />
    </div>
  );
};
