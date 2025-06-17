import React from "react";
import { Calendar } from "./components/Calendar";
import "./App.css";
import { CheckCalendar } from "./components/CheckCalendar/CheckCalendar";
import { FavoriteteamSelector } from "./components/FavoriteTeamSelector/FavoriteteamSelector";

function App() {
  return (
    <div className="App">
      <FavoriteteamSelector />
      <h1>観戦日カレンダー</h1>
      <CheckCalendar />
      <Calendar />
    </div>
  );
}

export default App;
