import React from "react";
import { useLocation } from "react-router-dom";
import "./CenterColumn.css";

import { TeamDashboard } from "../../TeamDashboard";
import { TransitionButton } from "./TransitionButton";

export const CenterColumn = ({ children }) => {
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
      {isResultPage && children}
    </div>
  );
};
