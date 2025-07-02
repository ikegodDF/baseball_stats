import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { LeftColumn } from "../../components/Layout/LeftColumn/LeftColumn";
import { CenterColumn } from "../../components/Layout/CenterColumn/CenterColumn";
import { RightColumn } from "../../components/Layout/RightColumn/RightColumn";
import "./Result.css";

export const Result = () => {
  const location = useLocation();
  const { selectedDays, selectedTeamId } = location.state || {};
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // モックデータ（実際はバックエンドから取得）
  const mockGameResults = [
    {
      id: 1,
      date: "2024-01-15",
      homeTeam: "読売ジャイアンツ",
      awayTeam: "阪神タイガース",
      homeScore: 5,
      awayScore: 3,
      stadium: "東京ドーム",
      attendance: 45000,
      result: "勝",
    },
    {
      id: 2,
      date: "2024-01-16",
      homeTeam: "中日ドラゴンズ",
      awayTeam: "広島東洋カープ",
      homeScore: 2,
      awayScore: 4,
      stadium: "ナゴヤドーム",
      attendance: 38000,
      result: "負",
    },
    {
      id: 3,
      date: "2024-01-17",
      homeTeam: "福岡ソフトバンクホークス",
      awayTeam: "埼玉西武ライオンズ",
      homeScore: 7,
      awayScore: 1,
      stadium: "福岡PayPayドーム",
      attendance: 42000,
      result: "勝",
    },
  ];

  const teamNum = {
    1: "g",
    2: "t",
    3: "d",
    4: "c",
    5: "s",
    6: "db",
    7: "h",
    8: "l",
    9: "m",
    10: "b",
    11: "f",
    12: "e",
  };

  useEffect(() => {
    // バックエンドAPIを呼び出す処理（現在はモックデータを使用）
    const fetchGameResults = async () => {
      setLoading(true);

      try {
        // 実際のバックエンドAPI呼び出し
        // const response = await fetch('/api/game-results', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ selectedDays })
        // });
        // const data = await response.json();

        // モックデータを使用（実際は上記のAPIレスポンス）
        await new Promise((resolve) => setTimeout(resolve, 1000)); // ローディング演出

        const response = await fetch("http://localhost:3000/api/game_results");
        const data = await response.json();
        console.log(data);

        const gameResults = selectedDays.map((date) => {
          const year = String(date.getFullYear());
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = month + String(date.getDate()).padStart(2, "0");
          const team = teamNum[selectedTeamId];
          console.log(year, month, day, team);
          const game = data[year][month][day][team];
          if (!game) return null;
          return {
            day: date.toLocaleDateString(),
            score: game.score,
            homeoraray: game.fora,
          };
        });
        setGameResults(gameResults);
      } catch (error) {
        console.error("試合結果の取得に失敗しました:", error);
        setGameResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDays && selectedDays.length > 0) {
      fetchGameResults();
    } else {
      setLoading(false);
    }
  }, [selectedDays]);

  return (
    <div className="result-container">
      <Header />
      <div className="content-container">
        <LeftColumn />
        <CenterColumn>
          <div className="result-content">
            <h2>試合結果</h2>

            {!selectedDays || selectedDays.length === 0 ? (
              <div className="no-selection">
                <p>日付が選択されていません</p>
                <p>カレンダーから日付を選択してください</p>
              </div>
            ) : (
              <>
                <div className="selected-dates-info">
                  <h3>選択された日付</h3>
                  <ul>
                    {selectedDays.map((date, index) => (
                      <li key={index}>{date.toLocaleDateString()}</li>
                    ))}
                  </ul>
                </div>

                {loading ? (
                  <div className="loading">
                    <p>試合結果を取得中...</p>
                  </div>
                ) : (
                  <div className="game-results-table">
                    <h3>試合結果一覧</h3>
                    {gameResults.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>日付</th>
                            <th>スコア</th>
                            <th>ホームorアウェイ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameResults.map((game) => (
                            <tr key={game.day}>
                              <td>{game.day}</td>
                              <td>{game.score}</td>
                              <td>{game.homeoraray}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>該当する試合結果が見つかりませんでした</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CenterColumn>
        <RightColumn />
      </div>
    </div>
  );
};
