import React from "react";
import { Calendar } from "./components/Calendar";
import "./App.css";
import { CheckCalendar } from "./components/CheckCalendar/CheckCalendar";

function App() {
  return (
    <div className="App">
      <h1>観戦日カレンダー</h1>
      <CheckCalendar />
      <Calendar />
    </div>
  );
}

export default App;
