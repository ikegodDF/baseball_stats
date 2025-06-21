import React from "react";
import { Header } from "../../components/Header/Header";
import { LeftColumn } from "../../components/Layout/LeftColumn/LeftColumn";
import { CenterColumn } from "../../components/Layout/CenterColumn/CenterColumn";
import { RightColumn } from "../../components/Layout/RightColumn/RightColumn";

import "./Home.css";

export const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="content-container">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>
    </div>
  );
};
