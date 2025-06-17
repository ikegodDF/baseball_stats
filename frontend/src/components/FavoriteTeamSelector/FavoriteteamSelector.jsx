import React, { useState } from "react";

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
  { teamId: 10, teamName: "オリックスバファローズ" },
  { teamId: 11, teamName: "北海道日本ハムファイターズ" },
  { teamId: 12, teamName: "東北楽天ゴールデンイーグルス" },
];

export const FavoriteteamSelector = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(inputDate[0].teamId);

  const selectedTeam = inputDate.find(
    (team) => team.teamId === Number(selectedTeamId)
  );

  return (
    <div>
      <h1>お気に入りのチーム</h1>
      <select
        id="team"
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
      >
        {inputDate.map((team) => (
          <option key={team.teamId} value={team.teamId}>
            {team.teamName}
          </option>
        ))}
      </select>
      <p>選択中のチーム: {selectedTeam?.teamName}</p>
    </div>
  );
};
