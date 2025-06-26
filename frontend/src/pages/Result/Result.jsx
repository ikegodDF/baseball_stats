import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { LeftColumn } from "../../components/Layout/LeftColumn/LeftColumn";
import { CenterColumn } from "../../components/Layout/CenterColumn/CenterColumn";
import { RightColumn } from "../../components/Layout/RightColumn/RightColumn";
import "./Result.css";

export const Result = () => {
  const location = useLocation();
  const { selectedDays, from } = location.state || {};
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
        setGameResults(mockGameResults);
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
                            <th>ホーム</th>
                            <th>スコア</th>
                            <th>アウェイ</th>
                            <th>球場</th>
                            <th>観客数</th>
                            <th>結果</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameResults.map((game) => (
                            <tr key={game.id}>
                              <td>{game.date}</td>
                              <td>{game.homeTeam}</td>
                              <td>
                                {game.homeScore} - {game.awayScore}
                              </td>
                              <td>{game.awayTeam}</td>
                              <td>{game.stadium}</td>
                              <td>{game.attendance.toLocaleString()}人</td>
                              <td
                                className={`result-${
                                  game.result === "勝" ? "win" : "lose"
                                }`}
                              >
                                {game.result}
                              </td>
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
