import React from "react";
import { Header } from "./components/Header/Header";
import { TeamDashboard } from "./components/TeamDashboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <TeamDashboard />
    </div>
  );
}

export default App;
