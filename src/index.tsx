import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Normalize } from "styled-normalize";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import LagRadar from "./LagRadar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Normalize />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* <LagRadar /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
