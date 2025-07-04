import React, { useState } from "react";
import "./Tab.css";

export const Tab = (contents) => {
  const [tab, setTab] = useState < number > 0;

  const handleTabClick = (tab) => {};

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        {contents.map((content, inde) => (
          <div
            onClick={() => {
              setTab(index);
              handleTabClick(tab);
            }}
            className={
              index === tab ? "tab-button-selected" : "tab-button-notselected"
            }
          >
            {content.text}
          </div>
        ))}
      </div>
      <div className="tab-underline"></div>
    </div>
  );
};
