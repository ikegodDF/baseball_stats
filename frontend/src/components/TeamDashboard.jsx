import React, { useState } from "react";
import { FavoriteteamSelector } from "./FavoriteTeamSelector/FavoriteteamSelector";
import { CheckCalendar } from "./CheckCalendar/CheckCalendar";
import { useSelectedTeam } from "../contexts/SelectedTeamContext";
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

  const { selectedTeamId, setSelectedTeamId } = useSelectedTeam();

  const selectedTeam =
    inputDate.find((team) => team.teamId === Number(selectedTeamId)) ||
    inputDate[0];

  //   お気に入りチーム選択機能
  const choiceTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const gameDays = gamedays[selectedTeam.teamName] || [];

  // Safari対応の安全な日付比較関数
  const isGameDay = (date) => {
    if (!gameDays || gameDays.length === 0) return false;

    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth() + 1;
    const dateDay = date.getDate();

    return gameDays.some((gameDay) => {
      const [year, month, day] = gameDay.date;
      return year === dateYear && month === dateMonth && day === dateDay;
    });
  };

  const isHome = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth() + 1;
    const dateDay = date.getDate();

    return gameDays.some((gameDay) => {
      const [year, month, day] = gameDay.date;
      return (
        year === dateYear &&
        month === dateMonth &&
        day === dateDay &&
        gameDay.role === "home"
      );
    });
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
        gameDays={gameDays}
        selectedTeam={selectedTeam}
        isGameDay={isGameDay}
        isHome={isHome}
      />
    </div>
  );
};
