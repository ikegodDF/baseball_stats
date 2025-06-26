import React from "react";
import { Header } from "../../components/Header/Header";
import { LeftColumn } from "../../components/Layout/LeftColumn/LeftColumn";
import { CenterColumn } from "../../components/Layout/CenterColumn/CenterColumn";
import { RightColumn } from "../../components/Layout/RightColumn/RightColumn";
import "./Result.css";

export const Result = () => {
  return (
    <div className="result-container">
      <Header />
      <div className="content-container">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>
    </div>
  );
};
