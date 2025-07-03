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
        const response = await fetch("http://localhost:3000/api/game_results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedDays,
            selectedTeamName: teamNum[selectedTeamId],
          }),
        });

        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const gameResults = selectedDays.map((date) => {
          return {
            day: date.toLocaleDateString(),
            stats: data,
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
  }, [selectedDays, selectedTeamId]);

  return (
    <div className="result-container">
      <Header />
      <div className="content-container">
        <LeftColumn />
        <CenterColumn>
          <div className="result-content">
            <h2>個人成績</h2>

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
                    <h3>累積統計データ</h3>
                    {gameResults.length > 0 ? (
                      <div>
                        <h4>打者統計</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>選手名</th>
                              <th>ポジション</th>
                              <th>打数</th>
                              <th>得点</th>
                              <th>安打</th>
                              <th>打点</th>
                              <th>盗塁</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(
                              gameResults[0]?.stats?.hitter || {}
                            ).map(([name, stats]) => (
                              <tr key={name}>
                                <td>{name}</td>
                                <td>{stats.position}</td>
                                <td>{stats.atBats}</td>
                                <td>{stats.runs}</td>
                                <td>{stats.hits}</td>
                                <td>{stats.rbi}</td>
                                <td>{stats.steals}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <h4>投手統計</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>選手名</th>
                              <th>投球数</th>
                              <th>投球回</th>
                              <th>被安打</th>
                              <th>被本塁打</th>
                              <th>四球</th>
                              <th>死球</th>
                              <th>奪三振</th>
                              <th>失点</th>
                              <th>自責点</th>
                              <th>勝</th>
                              <th>負</th>
                              <th>セーブ</th>
                              <th>ホールド</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(
                              gameResults[0]?.stats?.pitcher || {}
                            ).map(([name, stats]) => (
                              <tr key={name}>
                                <td>{name}</td>
                                <td>{stats.pitches}</td>
                                <td>{stats.innings}</td>
                                <td>{stats.hits}</td>
                                <td>{stats.homeruns}</td>
                                <td>{stats.walks}</td>
                                <td>{stats.hbp}</td>
                                <td>{stats.strikeouts}</td>
                                <td>{stats.r}</td>
                                <td>{stats.er}</td>
                                <td>{stats.win}</td>
                                <td>{stats.loss}</td>
                                <td>{stats.save}</td>
                                <td>{stats.hold}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
