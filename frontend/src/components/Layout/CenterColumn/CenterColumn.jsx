import React from "react";
import { useLocation } from "react-router-dom";
import "./CenterColumn.css";

import { TeamDashboard } from "../../TeamDashboard";
import { TransitionButton } from "./TransitionButton";

export const CenterColumn = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" || location.pathname === "/baseball_stats";
  const isResultPage = location.pathname === "/result";

  return (
    <div className="center-column">
      {isHomePage && (
        <>
          <TeamDashboard />
          <TransitionButton />
        </>
      )}
      {isResultPage && (
        <div className="result-content">
          <h2>試合結果</h2>
          <div className="game-result">
            <div className="team-scores">
              <div className="team home-team">
                <h3>ホームチーム</h3>
                <div className="score">5</div>
              </div>
              <div className="vs">vs</div>
              <div className="team away-team">
                <h3>アウェイチーム</h3>
                <div className="score">3</div>
              </div>
            </div>
            <div className="game-details">
              <p>日時: 2024年1月15日</p>
              <p>球場: 東京ドーム</p>
              <p>観客数: 45,000人</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
