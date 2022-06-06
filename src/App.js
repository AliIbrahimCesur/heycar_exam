import "./App.css";

import React from "react";
import Topbar from "./pages/Topbar";
import MainPage from "./pages/MainPage";
import "@progress/kendo-theme-default/dist/all.css";

const App = () => {
  return (
    <div className="App">
      <Topbar />
      <MainPage />
    </div>
  );
};

export default App;
